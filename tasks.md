# Bellaveste Backend Implementation Tasks

## Phase 1: Project Setup & Infrastructure
- [ ] Initialize Node.js project (package.json, .gitignore, .env).
- [ ] Install essential dependencies (express, mongoose, dotenv, cors, helmet, morgan, nodemon).
- [ ] Set up project folder structure (src/, controllers/, models/, routes/, etc.).
- [ ] Configure MongoDB connection (mongoose).
- [ ] Create basic Express server (app.js, server.js).
- [ ] Implement global error handling middleware (AppError, errorController).
- [ ] Implement async handler utility.

## Phase 2: User Management & Authentication
- [ ] Design User Schema (Mongoose).
- [ ] Implement User Registration (hash password with bcrypt).
- [ ] Implement User Login (generate JWT access/refresh tokens).
- [ ] Implement Logout & Refresh Token endpoints.
- [ ] Implement Authentication Middleware (protect routes).
- [ ] Implement Role-Based Authorization Middleware (admin only).
- [ ] Implement Forgot/Reset Password flow (email simulation).

## Phase 3: Product Catalog Management
- [ ] Design Product Schema (including variants, images, soft delete).
- [ ] Design Category & Collection Schemas.
- [ ] Implement CRUD for Categories & Collections (Admin only).
- [ ] Implement Product Creation (Admin) with image handling (URLs for now).
- [ ] Implement Product Update & Soft Delete (Admin).
- [ ] Implement Product Listing with Advanced Filtering (search, price, category, etc.).
- [ ] Implement Single Product View (by slug).

## Phase 4: Shopping Cart & Wishlist
- [ ] Design Cart & Wishlist Schemas (or embedded in User).
- [ ] Implement Add to Cart logic (stock validation).
- [ ] Implement Update Cart Quantity & Remove Item.
- [ ] Implement Get Cart & Clear Cart.
- [ ] Implement Wishlist Management (Add/Remove/Get).

## Phase 5: Reviews & Ratings
- [ ] Design Review Schema.
- [ ] Implement Add Review logic (one per product/user, purchased check optional for now).
- [ ] Implement Get Product Reviews.
- [ ] Implement Auto-calculation of Average Rating on Product model.
- [ ] Implement Admin Moderation (Delete review).

## Phase 6: Orders & Payments
- [ ] Design Order Schema.
- [ ] Implement Create Order logic (from Cart).
- [ ] Implement Inventory Deduction (atomic update).
- [ ] Implement Dummy Payment Gateway (mock API).
- [ ] Implement Get User Orders (history).
- [ ] Implement Get Single Order details.
- [ ] Implement Admin Order Management (List all, Update status).

## Phase 7: Admin Dashboard & Advanced Features
- [ ] Implement Admin Stats Endpoint (total sales, users, orders).
- [ ] Implement User Management for Admin (Block/Unblock).
- [ ] Implement Rate Limiting (express-rate-limit).
- [ ] Implement Security Headers (helmet, mongo-sanitize, xss-clean).
- [ ] Add API Documentation (Swagger/OpenAPI setup - optional but recommended).

## Phase 8: Testing & Refinement
- [ ] Manual testing of all endpoints via Postman/Insomnia.
- [ ] Unit testing setup (Jest/Supertest) - Basic tests for Auth/Products.
- [ ] Code cleanup and optimization.
- [ ] Final review against requirements.
