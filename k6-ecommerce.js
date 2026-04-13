import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const USER_EMAIL = __ENV.USER_EMAIL || 'john@example.com';
const USER_PASSWORD = __ENV.USER_PASSWORD || 'password123';

const DURATION = __ENV.DURATION || '30s';
const PUBLIC_RPS = Number(__ENV.PUBLIC_RPS || '20');
const AUTH_RPS = Number(__ENV.AUTH_RPS || '5');
const CHECKOUT_RPS = Number(__ENV.CHECKOUT_RPS || '1');

export const options = {
  scenarios: {
    public_browse: {
      executor: 'constant-arrival-rate',
      exec: 'publicBrowse',
      rate: PUBLIC_RPS,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: Math.min(Math.max(PUBLIC_RPS, 10), 200),
      maxVUs: Math.min(Math.max(PUBLIC_RPS * 5, 50), 1000)
    },
    auth_read: {
      executor: 'constant-arrival-rate',
      exec: 'authRead',
      rate: AUTH_RPS,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: Math.min(Math.max(AUTH_RPS, 5), 100),
      maxVUs: Math.min(Math.max(AUTH_RPS * 5, 20), 500)
    },
    checkout: {
      executor: 'constant-arrival-rate',
      exec: 'checkoutFlow',
      rate: CHECKOUT_RPS,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: Math.min(Math.max(CHECKOUT_RPS, 2), 20),
      maxVUs: Math.min(Math.max(CHECKOUT_RPS * 5, 10), 100)
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.05']
  }
};

function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function safeJson(res) {
  try {
    return res.json();
  } catch {
    return null;
  }
}

function getProductsList(json) {
  const products = json?.data?.products;
  return Array.isArray(products) ? products : [];
}

function getDataList(json) {
  const list = json?.data?.data;
  return Array.isArray(list) ? list : [];
}

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const loginJson = safeJson(loginRes);
  const token = loginJson?.token;

  if (!token) {
    throw new Error(`Login failed: ${loginRes.status} ${loginRes.body}`);
  }

  const categoriesRes = http.get(`${BASE_URL}/api/v1/categories`);
  const categoriesJson = safeJson(categoriesRes);
  const categories = getDataList(categoriesJson);

  const collectionsRes = http.get(`${BASE_URL}/api/v1/collections`);
  const collectionsJson = safeJson(collectionsRes);
  const collections = getDataList(collectionsJson);

  const productsRes = http.get(`${BASE_URL}/api/v1/products?limit=100`);
  const productsJson = safeJson(productsRes);
  const products = getProductsList(productsJson);

  const categoryIds = categories.map(c => c?._id).filter(Boolean);
  const productIds = products.map(p => p?._id).filter(Boolean);

  return {
    token,
    categoryIds,
    productIds,
    hasCollections: Array.isArray(collections) && collections.length > 0
  };
}

export function publicBrowse(data) {
  const categoryId = pickRandom(data.categoryIds);
  const productId = pickRandom(data.productIds);
  const page = Math.floor(Math.random() * 5) + 1;

  const res1 = http.get(`${BASE_URL}/api/v1/categories`);
  check(res1, { 'categories 200': r => r.status === 200 });

  if (data.hasCollections) {
    const res2 = http.get(`${BASE_URL}/api/v1/collections`);
    check(res2, { 'collections 200': r => r.status === 200 });
  }

  const res3 = http.get(`${BASE_URL}/api/v1/products?limit=12&page=${page}`);
  check(res3, { 'products list 200': r => r.status === 200 });

  if (categoryId) {
    const res4 = http.get(`${BASE_URL}/api/v1/products?category=${categoryId}&limit=12&page=${page}`);
    check(res4, { 'products by category 200': r => r.status === 200 });
  }

  if (productId) {
    const res5 = http.get(`${BASE_URL}/api/v1/products/${productId}`);
    check(res5, { 'product detail 200': r => r.status === 200 });
  }

  sleep(0.1);
}

export function authRead(data) {
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${data.token}`
    }
  };

  const res1 = http.get(`${BASE_URL}/api/v1/users/me`, authHeaders);
  check(res1, { 'me 200': r => r.status === 200 });

  const res2 = http.get(`${BASE_URL}/api/v1/cart`, authHeaders);
  check(res2, { 'cart 200': r => r.status === 200 });

  const res3 = http.get(`${BASE_URL}/api/v1/wishlist`, authHeaders);
  check(res3, { 'wishlist 200': r => r.status === 200 });

  const res4 = http.get(`${BASE_URL}/api/v1/orders/my-orders`, authHeaders);
  check(res4, { 'my orders 200': r => r.status === 200 });

  sleep(0.2);
}

export function checkoutFlow(data) {
  const productId = pickRandom(data.productIds);
  if (!productId) {
    sleep(0.5);
    return;
  }

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${data.token}`,
      'Content-Type': 'application/json'
    }
  };

  const addToCartRes = http.post(
    `${BASE_URL}/api/v1/cart`,
    JSON.stringify({
      productId,
      quantity: 1,
      variant: { size: 'M', color: 'Blue' }
    }),
    authHeaders
  );

  if (addToCartRes.status !== 200) {
    sleep(0.5);
    return;
  }

  const createOrderRes = http.post(
    `${BASE_URL}/api/v1/orders`,
    JSON.stringify({
      shippingAddress: {
        address: 'Test Address',
        city: 'Test City',
        postalCode: '00000',
        country: 'Test Country'
      },
      paymentMethod: 'cash',
      itemsPrice: 0,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 0
    }),
    authHeaders
  );

  check(createOrderRes, { 'order created or rejected': r => r.status === 201 || r.status === 400 });

  sleep(0.5);
}

