# User Acceptance Testing (UAT)

**Date:** 18 June 2026
**Team ID:** Banka Akshay Kumar Reddy
**Project Name:** ShopEZ (E-Commerce Platform)

## Project Overview

- **Project Name:** ShopEZ E-Commerce Platform
- **Project Description:** A highly responsive MERN-stack e-commerce web application featuring a unified administrative dashboard and dynamic theming.
- **Testing Scope:** End-to-end testing of User Authentication, Product Browsing, Cart Management, Checkout Workflows, and Secure Admin Functions.

## Core Test Cases

| TC ID | Scenario | Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- |
| TC-001 | User Registration | Navigate to /register, fill in email and password, submit. | User is created and redirected to Login page. | [ ] |
| TC-002 | User Login | Navigate to /login, enter credentials, submit. | JWT stored, user profile shown in navbar. | [ ] |
| TC-003 | Cart Functionality | Open a product page, click Add to Cart. | Cart counter in navbar increments instantly. | [ ] |
| TC-004 | Order Checkout | Open Cart, review items, click Place Order. | Order saved, cart cleared, success message shown. | [ ] |
| TC-005 | Admin Access | Log in as Admin, navigate to Admin Dashboard. | Dashboard loads. Non-admins receive 401 error. | [ ] |
| TC-006 | Dark Mode Toggle | Click the theme toggle button in the Navbar. | Full app switches to Dark Mode seamlessly. | [ ] |

## Bug Tracking Log

*(To be populated by the QA team during actual testing cycles)*

| Bug ID | Bug Description | Severity | Status |
| :--- | :--- | :--- | :--- |
| BG-001 | | Low / Med / High | Open / Closed |
| BG-002 | | Low / Med / High | Open / Closed |
