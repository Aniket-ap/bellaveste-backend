# Bellaveste Backend Specification

## 1. Business Requirements

### Business Goals
- **Platform Type**: Modern fashion eCommerce platform (Zara/H&M style).
- **Primary Goal**: Provide a seamless, high-performance shopping experience for users while offering robust management tools for administrators.
- **Scalability**: Designed to handle 100k+ users with production-ready architecture.

### User Roles
1. **Guest**: Can browse products, view details, add to cart (stored locally or temporary session), and register/login.
2. **User (Customer)**: Authenticated user who can manage profile, wishlist, cart, place orders, write reviews, and view order history.
3. **Admin**: Full access to manage products, categories, collections, orders, users, and view dashboard statistics.

### User Journey
1. **Browse**: User lands on home page, views featured products/collections.
2. **Filter**: User navigates to category/collection, applies filters (price, size, color, etc.).
3. **Product View**: User clicks a product, views details, images, sizes, and stock status.
4. **Add to Cart**: User selects variant and adds to cart.
5. **Checkout**: User proceeds to checkout, enters shipping details.
6. **Payment**: User completes payment (dummy implementation).
7. **Order Tracking**: User views order confirmation and tracks status in profile.

### Admin Workflow
1. **Login**: Admin logs in via secure portal.
2. **Dashboard**: Views sales stats and recent orders.
3. **Management**: Adds/Updates products, manages inventory, processes orders (update status), and moderates reviews/users.

### Order Lifecycle
1. **Pending**: Order created, payment pending (if applicable) or immediate success.
2. **Processing**: Payment confirmed, order being prepared.
3. **Shipped**: Order handed to carrier.
4. **Delivered**: Order received by customer.
5. **Cancelled**: Order cancelled by user or admin.

---

## 2. Functional Requirements

### Authentication
- **Register**: Email/Password registration with validation.
- **Login**: Authenticate with email/password, return JWT + Refresh Token.
- **Refresh Token**: Rotation mechanism for security.
- **Logout**: Invalidate refresh token.
- **Password Reset**: Email-based flow (generate token, send email, verify, reset).
- **Role-Based Access**: Middleware to protect admin routes.

### Product Management
- **CRUD**: Create, Read, Update, Delete (Soft delete) products.
- **Attributes**: Name, description, price, sale price, SKU, stock quantity.
- **Variants**: Sizes (S, M, L, XL), Colors (Hex codes + names).
- **Media**: Multiple images support (primary + gallery).
- **SEO**: Auto-generated slug from name.
- **Features**: "Featured" flag for homepage display.

### Filtering System
- **Filters**: Category, Collection, Price Range, Size, Color, Rating (0-5), In-stock only.
- **Search**: Text search on product name and description (indexed).
- **Sorting**: Price (Low-High, High-Low), Newest, Popularity (sales/views).
- **Pagination**: Limit/Offset or Cursor-based pagination.

### Categories & Collections
- **Categories**: Men, Women, Kids, Accessories (Hierarchical if needed).
- **Collections**: Summer 2024, Winter Sale, New Arrivals.
- **CRUD**: Admin management for both.

### Cart
- **Operations**: Add item, Remove item, Update quantity.
- **Validation**: Check stock availability before adding/updating.
- **Calculation**: Subtotal, Tax (optional), Shipping, Total.
- **Persistence**: Database storage for logged-in users.

### Wishlist
- **Operations**: Add to wishlist, Remove from wishlist, Move to cart.
- **Privacy**: Private per user.

### Reviews
- **Creation**: User can review purchased products.
- **Validation**: One review per product per user.
- **Rating**: 1-5 star rating.
- **Aggregation**: Auto-update average rating on Product model.

### Order Management
- **Creation**: Create order from cart contents.
- **Inventory**: Atomic deduction of stock upon order creation/payment.
- **History**: List user's past orders with details.
- **Admin Control**: View all orders, filter by status, update status.

### Payment (Dummy Implementation)
- **API**: `/api/v1/payment/process`.
- **Logic**: Accept card details, validate format, generate fake transaction ID, return success/failure.
- **Security**: Never store raw card numbers (store masked: `****-****-****-1234`).

### Admin Panel (Backend Support)
- **User Management**: List users, Block/Unblock.
- **Stats**: Total Revenue, Order Count, User Count, Top Selling Products.

---

## 3. Non-Functional Requirements

### Security
- **Password Hashing**: bcryptjs with appropriate salt rounds.
- **JWT**: Short-lived access tokens (15m), long-lived refresh tokens (7d).
- **Headers**: Helmet for security headers.
- **Rate Limiting**: Express-rate-limit for API endpoints.
- **Input Validation**: Joi or Zod for request body validation.
- **Sanitization**: Mongo injection prevention.

### Architecture & Quality
- **Architecture**: MVC (Model-View-Controller) or Layered (Controller-Service-Data).
- **Error Handling**: Centralized error handling middleware.
- **Logging**: Winston or Morgan for access/error logs.
- **Config**: Environment variables (dotenv).
- **Versioning**: API versioning (v1).
- **Response Format**: Standardized JSON (success, message, data, error).

---

## 4. Database Design (MongoDB + Mongoose)

### User Schema
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: { type: String, required: true, index: true },
  slug: { type: String, unique: true, index: true },
  description: String,
  price: { type: Number, required: true, index: true },
  salePrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  images: [String], // URLs
  variants: [{
    size: String,
    color: String,
    stock: Number
  }],
  totalStock: { type: Number, default: 0 }, // Aggregated
  rating: { type: Number, default: 0, index: true },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false, index: true }, // Soft delete
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  image: String,
  description: String
}
```

### Order Schema
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, // Snapshot
    price: Number, // Snapshot
    quantity: Number,
    variant: { size: String, color: String }
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  payment: {
    method: String,
    transactionId: String,
    status: { type: String, enum: ['pending', 'paid', 'failed'] },
    amount: Number
  },
  status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. API Design

### Base URL: `/api/v1`

#### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

#### Products
- `GET /products` (Query params: ?page=1&limit=10&category=xyz&minPrice=10&sort=-price)
- `GET /products/:slug`
- `POST /products` (Admin)
- `PUT /products/:id` (Admin)
- `DELETE /products/:id` (Admin)

#### Categories & Collections
- `GET /categories`
- `POST /categories` (Admin)
- `GET /collections`
- `POST /collections` (Admin)

#### Cart
- `GET /cart`
- `POST /cart` (Add item)
- `PUT /cart/item/:id` (Update qty)
- `DELETE /cart/item/:id` (Remove)

#### Orders
- `POST /orders` (Create)
- `GET /orders/my-orders` (User history)
- `GET /orders/:id`
- `GET /admin/orders` (Admin: all orders)
- `PATCH /admin/orders/:id/status` (Admin: update status)

#### Users (Admin)
- `GET /admin/users`
- `PATCH /admin/users/:id/block`

#### Dashboard (Admin)
- `GET /admin/stats`

---

## 6. Project Architecture

### Folder Structure
```
src/
├── config/         # DB connection, environment vars
├── controllers/    # Request handlers
├── middlewares/    # Auth, Error, Validation
├── models/         # Mongoose schemas
├── routes/         # API routes
├── services/       # Business logic (optional, for cleaner controllers)
├── utils/          # Helper functions (AsyncHandler, APIFeatures, AppError)
├── validations/    # Joi/Zod schemas
└── app.js          # Express app setup
server.js           # Entry point
```

### Key Components
- **AsyncHandler**: Wrapper to catch async errors without try-catch blocks.
- **AppError**: Custom error class with operational status codes.
- **APIFeatures**: Class for filtering, sorting, pagination logic.

---

## 7. Advanced Features (Production Ready)
- **Refresh Token Rotation**: Detect reuse of refresh tokens to prevent theft.
- **Activity Logs**: Track admin actions (who deleted what product).
- **Helmet & CORS**: Strict security policies.
- **Compression**: Gzip compression for responses.
