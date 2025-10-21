# 💼 E-Wallet Management System (MERN Backend)

## 📌 Overview
This is a **modular, role-based backend system** for a digital wallet platform, built with **Node.js, Express, and MongoDB (Mongoose)**.  
It supports **three roles** — `User`, `Agent`, and `Admin` — each with specific access levels and functionality.

---

## 🚀 Features by Role

### 👤 User Features
- Register and Login (JWT-based Authentication)
- View wallet balance and transaction history
- Add money (via agent cash-in)
- Withdraw or send money to another user
- View transaction logs

### 🧑‍💼 Agent Features
- Cash-in (add balance to user wallet)
- Cash-out (withdraw from user wallet)
- Earn commission automatically (1% per transaction)
- View commission history

### 👑 Admin Features
- View all users
- View all wallets
- Block / Unblock any wallet
- Approve / Suspend agents

---

## 🏗️ Project Structure

src/
├── modules/
│ ├── auth/ # Authentication & JWT logic
│ ├── user/ # User controller, model & routes
│ ├── wallet/ # Wallet management module
│ ├── agent/ # Agent-specific operations (cash-in/out, commission)
│ └── admin/ # Admin routes & controllers
├── middlewares/ # Token verification, role-based authorization
├── config/ # Environment variables, DB connection
├── utils/ # Helper functions (if needed)
├── app.ts # Main entry point

Authentication Flow
| Step         | Endpoint                         | Method | Description                       |
| ------------ | -------------------------------- | ------ | --------------------------------- |
| Register     | `/users/register`                | POST   | Create a new user                 |
| Token Verify | `Authorization: Bearer <token>`  | Header | Required for all protected routes |



User API Endpoints
| Action             | Endpoint             | Method | Description                      |
| ------------------ | -------------------- | ------ | -------------------------------- |
| Register User      | `/users/register`    | POST   | Register a new user              |
| Get All Users      | `/users/`            | GET    | View all users (for testing/dev) |
| Get My Profile     | `/users/me`          | GET    | Get logged-in user’s profile     |
| Block/Unblock User | `/users/block/:id`   | PATCH  | Block or unblock a user          |
| Approve Agent      | `/users/approve/:id` | PATCH  | Approve a user as agent          |


wallet api
| Action         | Endpoint            | Method | Description                 |
| -------------- | ------------------- | ------ | --------------------------- |
| Get My Wallet  | `/wallets/me`       | GET    | View current user’s wallet  |
| Add Money      | `/wallets/deposit`  | POST   | Deposit money (add balance) |
| Withdraw Money | `/wallets/withdraw` | POST   | Withdraw from wallet        |
| Send Money     | `/wallets/send`     | POST   | Send money to another user  |


Agent API Endpoints
| Action             | Endpoint             | Method | Description                  |
| ------------------ | -------------------- | ------ | ---------------------------- |
| Cash-In            | `/agent/cash-in`     | POST   | Add money to a user’s wallet |
| Cash-Out           | `/agent/cash-out`    | POST   | Withdraw money from a user   |
| Commission History | `/agent/commissions` | GET    | View earned commissions      |



Admin API Endpoints
| Action                  | Endpoint                    | Method | Description               |
| ----------------------- | --------------------------- | ------ | ------------------------- |
| View All Users          | `/admin/users`              | GET    | View all registered users |
| View All Wallets        | `/admin/wallets`            | GET    | View all wallets          |
| Block / Unblock Wallet  | `/admin/wallets/:id/status` | PATCH  | Change wallet status      |
| Approve / Suspend Agent | `/admin/agents/:id/status`  | PATCH  | Manage agent status       |



🧠 Tech Stack
Backend: Node.js, Express.js, TypeScript
Database: MongoDB (Mongoose ORM)
Auth: JWT (JSON Web Token)
Validation: Mongoose Schema Validation
Testing: Postman



