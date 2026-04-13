# Bellaveste Backend Development Checklist

- [ ] **Project Setup**
  - [ ] Node.js & npm init
  - [ ] Express.js server basic structure
  - [ ] MongoDB connection (Mongoose)
  - [ ] Environment variables (.env)

- [ ] **Authentication Module**
  - [ ] User Model & Schema
  - [ ] Registration (Password Hashing)
  - [ ] Login (JWT Access/Refresh Tokens)
  - [ ] Middleware (protect, restrictTo)
  - [ ] Forgot/Reset Password

- [ ] **Product Management**
  - [ ] Product Model (Slug, Images, Variants)
  - [ ] Category & Collection Models
  - [ ] Admin CRUD Operations
  - [ ] Advanced Filtering & Sorting
  - [ ] Image Upload (Cloudinary or local storage mock)

- [ ] **Shopping Features**
  - [ ] Cart Model & Logic
  - [ ] Wishlist Model & Logic
  - [ ] Reviews & Ratings System

- [ ] **Order System**
  - [ ] Order Model & Status Enum
  - [ ] Checkout Process (Create Order)
  - [ ] Inventory Management (Stock decrement)
  - [ ] Payment Integration (Dummy Mock)

- [ ] **Admin Features**
  - [ ] Dashboard Statistics
  - [ ] User Management (Block/Unblock)
  - [ ] Order Management (Status updates)

- [ ] **Security & Optimization**
  - [ ] Rate Limiting
  - [ ] Security Headers (Helmet)
  - [ ] Data Sanitization (NoSQL Injection)
  - [ ] Error Handling (Global AppError)
  - [ ] Logging (Winston/Morgan)
