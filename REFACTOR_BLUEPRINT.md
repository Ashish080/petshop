# 🏗️ Pet Shop Multi-Portal Refactor: Architecture & Layout

This document details the refined technical architecture for the **Kanha Pet Shop** logistics ecosystem, separating concerns into three specialized portals (User, Rider, Admin).

---

## 1. Domain-Driven Folder Structure

```text
src/
├── app/
│   ├── (storefront)/         # 👤 USER PORTAL (Consumer Experience)
│   │   ├── products/         #   - Product Browsing (Login Required)
│   │   ├── dashboard/        #   - Mission Hub: Tracking & Feedback
│   │   ├── checkout/         #   - Order Placement (Secure Protocol)
│   │   └── orders/           #   - Historical Archive Access
│   ├── admin/                # 👨💼 ADMIN portal (Command & Control)
│   │   ├── (protected)/      #   - RBAC-Guarded Administrative Hub
│   │   │   ├── analytics/    #     - Portfolio Intelligence Dash
│   │   │   └── orders/       #     - Dispatch & Mission Management
│   │   └── auth/             #   - Restricted Login Portal
│   ├── rider/                # 🛵 RIDER PORTAL (Tactical Delivery)
│   │   ├── orders/           #   - Mission Details & Status Update
│   │   └── auth/             #   - Signup & Gateway for Field Agents
│   └── api/                  # 🛡️ UNIFIED BACKEND LAYER
│       ├── auth/             #   - RBAC JWT Generation & Registration
│       ├── admin/            #   - High-Level Fleet Management 
│       ├── rider/            #   - Tactical Mission Execution 
│       └── orders/           #   - Standard Lifecycle Operations
├── models/                   # 💿 DATA ARCHITECTURE (Mongoose)
│   ├── User.ts               #   - Role-Based Identity (RBAC)
│   ├── Order.ts              #   - Logistical Payload & Feedback
│   └── Product.ts            #   - SKU Demands & Portfolio Metrics
└── middleware.ts             # 🚧 EDGE GATEWAY (Strict RBAC Guard)
```

---

## 2. Refined Database Schema (Mongoose)

### **Order Model**
*   `riderId`: Relationship to `User` (role: rider).
*   `orderStatus`: 8-stage lifecycle (`pending`, `confirmed`, `accepted`, `picked`, `out-for-delivery`, `delivered`, `shipped`, `cancelled`).
*   `feedback`: Rating (1-5) and comment sub-document.

### **Product Model**
*   `demandCount`: Atomic counter for ranking SKU velocity.

---

## 3. Mission-Critical Lifecycle Flow

1.  **Placement**: `User` creates order → Status: `pending`.
2.  **Assignment**: `Admin` identifies verified `Rider` and assigns them to mission.
3.  **Acceptance**: `Rider` identifies new assignment and signals `Accepted`.
4.  **Execution**: `Rider` progresses mission: `Picked` → `In Transit`.
5.  **Completion**: `Rider` signals `Delivered`.
6.  **Debrief**: `User` evaluates mission via **Star-Rating & Feedback** on dashboard.

---

## 4. Real-Time Signal Protocol
The system currently uses **30s Automated Polling** on the User and Rider dashboards to ensure steady status synchronization. This ensures zero dependencies on heavy socket libraries while maintaining high-fidelity tracking.

---

## 5. Security & RBAC Enforcement
A global `middleware.ts` guards all portals at the edge, ensuring:
-   **Admin Only**: `/admin/*`
-   **Rider Only**: `/rider/*`
-   **Authenticated Users**: `/dashboard`, `/checkout`, `/cart`
