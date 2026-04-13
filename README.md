# Bellaveste Backend API

This is the backend API for the Bellaveste eCommerce platform, built with Node.js, Express, and MongoDB.

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Categories & Collections](#categories--collections)
  - [Cart](#cart)
  - [Wishlist](#wishlist)
  - [Reviews](#reviews)
  - [Orders](#orders)
  - [Admin](#admin)

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the server**:
    ```bash
    npm start
    # or for development
    npm run dev
    ```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/bellaveste
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

---

## API Documentation

**Base URL**: `/api/v1`

### Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login user | No |
| `POST` | `/auth/logout` | Logout user | Yes |
| `POST` | `/auth/refresh-token` | Refresh access token | No |
| `POST` | `/auth/forgot-password` | Request password reset | No |
| `PATCH` | `/auth/reset-password/:token` | Reset password | No |

**Register Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Login Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "data": { "user": { ... } }
}
```

### Users

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Get current user profile | Yes |
| `PATCH` | `/users/updateMe` | Update profile details | Yes |
| `PATCH` | `/users/updateMyPassword` | Update password | Yes |
| `DELETE` | `/users/deleteMe` | Deactivate account | Yes |
| `GET` | `/users` | Get all users (Admin) | Admin |
| `PATCH` | `/users/:id/block` | Block a user (Admin) | Admin |
| `PATCH` | `/users/:id/unblock` | Unblock a user (Admin) | Admin |

### Products

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Get all products (with filters) | No |
| `GET` | `/products/:id` | Get single product | No |
| `GET` | `/products/top-5-cheap` | Get top 5 cheap products | No |
| `POST` | `/products` | Create product (Admin) | Admin |
| `PATCH` | `/products/:id` | Update product (Admin) | Admin |
| `DELETE` | `/products/:id` | Delete product (Admin) | Admin |

**Query Parameters:**
- `?page=1&limit=10`
- `?sort=-price` (Sort by price descending)
- `?price[gte]=100` (Filter price >= 100)
- `?category=categoryId`

**Create Product Body:**
```json
{
  "name": "Summer Dress",
  "description": "Beautiful dress",
  "price": 59.99,
  "category": "category_id",
  "imageCover": "url_to_image",
  "variants": [
    { "size": "M", "color": "Red", "stock": 10 }
  ]
}
```

### Categories & Collections

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Get all categories | No |
| `POST` | `/categories` | Create category | Admin |
| `GET` | `/collections` | Get all collections | No |
| `POST` | `/collections` | Create collection | Admin |

### Cart

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/cart` | Get user cart | Yes |
| `POST` | `/cart` | Add item to cart | Yes |
| `PATCH` | `/cart/update-item` | Update item quantity | Yes |
| `DELETE` | `/cart/remove-item/:itemId` | Remove item | Yes |
| `DELETE` | `/cart` | Clear cart | Yes |

**Add to Cart Body:**
```json
{
  "productId": "product_id",
  "quantity": 1,
  "variant": { "size": "M", "color": "Blue" }
}
```

### Wishlist

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/wishlist` | Get user wishlist | Yes |
| `POST` | `/wishlist` | Add item to wishlist | Yes |
| `DELETE` | `/wishlist/:productId` | Remove item | Yes |

### Reviews

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/reviews` | Get all reviews | No |
| `POST` | `/reviews` | Create review | User |
| `GET` | `/products/:productId/reviews` | Get reviews for product | No |
| `POST` | `/products/:productId/reviews` | Add review for product | User |

**Create Review Body:**
```json
{
  "review": "Great product!",
  "rating": 5,
  "product": "product_id" // Optional if using nested route
}
```

### Orders

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Create new order | Yes |
| `GET` | `/orders/my-orders` | Get current user's orders | Yes |
| `GET` | `/orders/:id` | Get order details | Yes |
| `GET` | `/orders` | Get all orders | Admin |
| `PATCH` | `/orders/:id/pay` | Mark order as paid | Yes |
| `PATCH` | `/orders/:id/deliver` | Mark order as delivered | Admin |
| `PATCH` | `/orders/:id/status` | Update order status | Admin |

**Create Order Body:**
```json
{
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card",
  "itemsPrice": 100,
  "taxPrice": 10,
  "shippingPrice": 5,
  "totalPrice": 115
}
```

### Admin

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats` | Get dashboard statistics | Admin |

**Stats Response:**
```json
{
  "status": "success",
  "data": {
    "totalUsers": 150,
    "totalOrders": 45,
    "totalProducts": 300,
    "totalSales": 5000
  }
}
```
