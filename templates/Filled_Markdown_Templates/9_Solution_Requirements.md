# Solution Requirements (Functional & Non-functional)

**Date:** 18 June 2026  
**Team ID:** Banka Akshay Kumar Reddy  
**Project Name:** ShopEZ (E-Commerce Platform)  

## Functional Requirements (FR)
These outline the specific behaviors and features the system must support:

| FR No. | Epic / Feature Area | Detailed Sub-Requirement |
| :--- | :--- | :--- |
| **FR-1** | User Management | Registration form, Login authentication, Stateless session handling, Role-based Access Control (distinguishing Customer vs. Admin). |
| **FR-2** | Product Catalog | Fetch all products from API, Filter by category/price, View detailed single-product pages with dynamic variants. |
| **FR-3** | Cart Operations | Add items to cart, Remove items, Automatically calculate total cost including potential taxes/discounts dynamically. |
| **FR-4** | Order Processing | Convert cart items into a finalized order, Clear user's cart post-purchase, Allow users to view their historical orders. |
| **FR-5** | Admin Panel | Secure dashboard to Add/Edit/Delete products, Update global store banners, View and manage lifecycle of user orders. |

## Non-Functional Requirements (NFR)
These define system attributes such as performance, usability, and security:

| FR No. | Non-Functional Requirement | Description & Measurement |
| :--- | :--- | :--- |
| **NFR-1** | Usability & Accessibility | Must provide an intuitive, responsive UI that works flawlessly on mobile devices. Must include customized Light/Dark themes for user comfort. |
| **NFR-2** | Security & Privacy | Passwords must be hashed using Bcrypt (minimum 10 salt rounds). API endpoints must be protected using robust JWT stateless authentication. |
| **NFR-3** | Performance Optimization | Client-side routing via React Router v6 must ensure sub-second page transitions, providing a native app-like experience. |
| **NFR-4** | Database Scalability | Leveraging a NoSQL database (MongoDB) allows for a flexible schema, accommodating future product types and catalog expansion effortlessly. |
