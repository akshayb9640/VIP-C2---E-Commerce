# Data Flow Diagrams & User Stories

**Date:** 18 June 2026  
**Team ID:** Banka Akshay Kumar Reddy  
**Project Name:** ShopEZ (E-Commerce Platform)  

## Detailed User Stories and Acceptance Criteria

| User Type | Epic Category | USN | User Story | Acceptance Criteria | Priority | Release |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Customer** | Authentication | USN-1 | As a user, I can register a new account and log in. | Passwords must be hashed in the database. Upon login, a JWT token is stored in localStorage. | High | Sprint-1 |
| **Customer** | Shopping Journey | USN-2 | As a user, I can browse the catalog and filter products. | Products display correctly on mobile and desktop. Categories correctly filter the displayed list. | High | Sprint-2 |
| **Customer** | Cart Management | USN-3 | As a user, I can manage my shopping cart and proceed to checkout. | The cart icon updates its counter instantly. Cart contents persist during the session. Orders are saved accurately. | High | Sprint-3 |
| **Administrator** | Inventory Dashboard | USN-4 | As an admin, I can manage the entire product catalog from a web interface. | Admin can successfully add new products, edit existing prices, and delete discontinued items securely. | High | Sprint-4 |
| **Administrator** | Order Tracking | USN-5 | As an admin, I can view and update customer order statuses. | Admin can see a list of all incoming orders, view shipping details, and mark them as shipped or delivered. | High | Sprint-4 |
