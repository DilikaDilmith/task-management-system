# 🚀 Task Management System - Full Stack Assessment

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-v4-lightgrey?style=flat-square&logo=express)
![React](https://img.shields.io/badge/React-v18+-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-v8.0-blue?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Protected-black?style=flat-square&logo=json-web-tokens)

A modern full-stack Task Management System developed for the **Koncepthive Full Stack Web Developer Intern Technical Assessment**. The system allows users to authenticate securely and manage daily tasks with real-time dynamic dashboard metrics, multi-filtering, search, sorting, and responsive dark-mode styling.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Key Features](#-key-features)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [API Documentation](#-api-documentation)
- [Assumptions Made](#-assumptions-made)
- [Known Limitations](#-known-limitations)
- [Bonus Features Implemented](#-bonus-features-implemented)

---

## 📖 Project Overview

This application provides an end-to-end task management interface designed to boost daily productivity. It features secure stateless authentication (JWT), dynamic analytical statistics, full task CRUD capabilities, server-side and client-side input validations, multi-criteria filtering, and live search.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), Tailwind CSS v4, Lucide React Icons, Axios, React Router DOM v6.
* **Backend:** Node.js, Express.js REST API.
* **Database:** MySQL (`mysql2` driver with Connection Pooling).
* **Security:** JWT (`jsonwebtoken`) Authentication & `bcryptjs` Password Hashing.

---

## 🌟 Key Features

1. **🔐 Authentication**: JWT-based login and session persistence using local storage. Pre-seeded admin user included.
2. **📊 Dynamic Dashboard Metrics**: Displays dynamic counts for Total Tasks, Pending, In Progress, Completed, and Overdue tasks.
3. **📝 Task CRUD Operations**: Complete Create, Read, Update, and Delete functionalities.
4. **🔍 Search & Filtering**: Instant title search along with combined filtering by Status (`Pending`, `In Progress`, `Completed`) and Priority (`Low`, `Medium`, `High`).
5. **🔀 Sorting**: Sort tasks dynamically by **Newest Created**, **Oldest Created**, or **Due Date**.
6. **🛡️ Validation**: Client-side and server-side rules preventing past due dates, empty titles, and missing required parameters.
7. **📱 Fully Responsive**: Custom mobile-first Glassmorphic Dark Mode UI designed for Mobile, Tablet, and Desktop screens.

---

## 🗄️ Database Schema

### `users` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | User ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | User Name |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Login Email |
| `password` | `VARCHAR(255)` | `NOT NULL` | Hashed Password |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Account Created Timestamp |

### `tasks` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY, AUTO_INCREMENT` | Task ID |
| `title` | `VARCHAR(255)` | `NOT NULL` | Task Title |
| `description` | `TEXT` | `NULLABLE` | Task Details |
| `priority` | `ENUM` | `'Low', 'Medium', 'High'` | Priority Level |
| `status` | `ENUM` | `'Pending', 'In Progress', 'Completed'` | Execution Status[cite: 1] |
| `due_date` | `DATE` | `NOT NULL` | Deadline Date[cite: 1] |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Auto-generated timestamp[cite: 1] |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE` | Auto-updated timestamp[cite: 1] |

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory based on the following template[cite: 1]:

```env

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_management_db
JWT_SECRET=super_secret_jwt_key_12345 ```

```
---
## 🚀 Installation & Setup
Prerequisites
Node.js (v18+) installed[cite: 1].

MySQL Server installed and running locally[cite: 1].

1. Database Setup
Create a new MySQL database named task_management_db[cite: 1]:
```
CREATE DATABASE task_management_db;
```
2. Backend Setup
```# Navigate into backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables (.env file)
# Start the backend server
npm run dev
```
💡 Automatic Table & Seed Setup: The backend automatically initializes required tables (users, tasks) and seeds the default admin account on server boot[cite: 1].
3. Frontend Setup
```
# Navigate into frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev

```
---

Visit` http://localhost:5173` in your browse

---

## 🔐 Default Admin Credentials
Use these credentials to log in:

Email: `admin@test.com`

Password: `123456`
