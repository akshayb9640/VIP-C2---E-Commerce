# Full Stack Development with MERN

## 1. Introduction

*   **Project Title:** ShopEZ (E-Commerce Platform)
*   **Team Members:** Akshay (Full Stack Developer)

## 2. Project Overview

*   **Purpose:** To build a fully functional, responsive e-commerce web application that allows users to browse products, manage their shopping carts, place orders, and provides administrators with a dashboard to manage the store's inventory and settings.
*   **Features:**
    *   User authentication (Registration and Login)
    *   Product browsing and category filtering
    *   Shopping cart management
    *   Checkout and order placement
    *   Admin panel for managing products, categories, and banners
    *   Light/Dark mode toggle for basic UI customization

## 3. Architecture

*   **Frontend:** The frontend is built using **React.js** (bootstrapped with Vite) for a fast, component-based user interface. It utilizes standard CSS for styling to maintain a clean, accessible, and simple design. It interacts with the backend via RESTful APIs using `axios`.
*   **Backend:** The backend is powered by **Node.js** and **Express.js**, providing a robust REST API for handling business logic, authentication, and database operations.
*   **Database:** The application uses **MongoDB** as a NoSQL database. Mongoose is used as an ODM (Object Data Modeling) library to define schemas for `users`, `admin`, `products`, `orders`, and `cart`.

## 4. Setup Instructions

*   **Prerequisites:**
    *   Node.js (v14 or higher)
    *   MongoDB (Local installation or MongoDB Atlas URI)
    *   Git
*   **Installation:**
    1.  Clone the repository:
        ```bash
        git clone https://github.com/akshayb9640/VIP-C2---E-Commerce.git
        cd VIP-C2---E-Commerce
        ```
    2.  Install Backend Dependencies:
        ```bash
        cd server
        npm install
        ```
    3.  Set up environment variables in `server/.env`:
        ```env
        PORT=5000
        MONGO_URI=mongodb://127.0.0.1:27017/shopez
        JWT_SECRET=your_jwt_secret_key
        ```
    4.  Install Frontend Dependencies:
        ```bash
        cd ../client
        npm install
        ```

## 5. Folder Structure

*   **Client:** Contains the React frontend application.
    *   `src/`: Main source code directory.
        *   `components/`: Reusable React components (Navbar, ProductCard, etc.).
        *   `pages/`: Main views (Home, Login, Cart, Admin Panel).
        *   `App.jsx`: Main application routing.
        *   `index.css`: Global styles and theme variables.
*   **Server:** Contains the Node.js/Express backend API.
    *   `routes/`: API endpoint definitions (`authRoutes`, `productRoutes`, `cartRoutes`, `orderRoutes`, `adminRoutes`).
    *   `controllers/`: Logic for handling API requests.
    *   `middleware/`: Authentication and error-handling middleware.
    *   `Schema.js`: Mongoose models.
    *   `index.js`: Main server entry point.

## 6. Running the Application

*   **Backend:** Start the Node.js server from the `server` directory.
    ```bash
    cd server
    npm run dev
    # or npm start
    ```
*   **Frontend:** Start the Vite React development server from the `client` directory.
    ```bash
    cd client
    npm run dev
    ```

## 7. API Documentation

The backend exposes several REST API endpoints:

*   **Authentication (`/auth`)**
    *   `POST /auth/register` - Register a new user
    *   `POST /auth/login` - Authenticate user and issue JWT
*   **Products (`/products`)**
    *   `GET /products` - Fetch all products
    *   `GET /products/:id` - Fetch a single product
    *   `POST /products` - Add a new product (Admin)
*   **Cart (`/cart`)**
    *   `GET /cart` - Get current user's cart items
    *   `POST /cart` - Add an item to the cart
    *   `DELETE /cart/:id` - Remove an item from the cart
*   **Orders (`/orders`)**
    *   `GET /orders` - View user's order history
    *   `POST /orders` - Place a new order
*   **Admin (`/admin`)**
    *   `GET /admin/config` - Get store configuration (banners, categories)

## 8. Authentication

*   Authentication is handled using **JSON Web Tokens (JWT)** and **bcryptjs** for password hashing.
*   Upon successful login, the server issues a JWT, which is securely stored in HTTP-only cookies (using `cookie-parser`).
*   Protected routes use a custom middleware to verify the JWT from the cookie before granting access to user-specific resources like the cart, orders, or admin functionalities.

## 9. User Interface

*   The UI is designed to be clean, straightforward, and easy to navigate. It features a custom hero banner, clear product grids, and a simplified checkout process.
*   **Features showcased:** Home page with banners, product catalog, shopping cart interface, login/registration forms, and an admin management dashboard.

## 10. Testing

*   **Strategy:** Manual testing was conducted to ensure core functionalities work as expected.
*   **Tools Used:** Postman (for testing backend API endpoints), Chrome DevTools (for frontend debugging, responsive design testing, and inspecting network requests/cookies).

## 11. Screenshots or Demo

*   *(To be added)* Please include screenshots of the Home Page, Product Page, Cart, and Admin Dashboard here.

## 12. Known Issues

*   Image uploads currently rely on external URLs or local public folders rather than a dedicated cloud storage service (e.g., AWS S3 or Cloudinary).
*   Password reset functionality is not yet implemented.

## 13. Future Enhancements

*   Integration of a real payment gateway (e.g., Stripe or Razorpay) for checkout.
*   Implementation of user reviews and ratings for products.
*   Cloudinary integration for robust image hosting and uploading from the admin panel.
*   Advanced search functionality with sorting and filtering options.
