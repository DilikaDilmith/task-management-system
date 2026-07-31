# 🚀 Full-Stack Task Management System

A responsive, secure, and modern full-stack Task Management application built using **Node.js, Express, MySQL** for the Backend and **React, Vite, Tailwind CSS v4** for the Frontend.

---

## 🌟 Key Features

* 🔐 **Authentication & Authorization**: Secure JWT-based user login with seeded admin account.
* 📊 **Interactive Dashboard**: Real-time summary statistics for Total, Pending, In Progress, Completed, and Overdue tasks.
* 📝 **Task CRUD Operations**: Complete Create, Read, Update, and Delete functionalities.
* 🔍 **Search & Filters**: Search tasks by title and filter by Status or Priority.
* 📅 **Validation & Security**: Server-side validations (e.g., due dates cannot be in the past) and protected API endpoints using custom JWT middleware.
* 🎨 **Modern Dark UI**: Designed with Tailwind CSS v4 and Lucide React icons.

---

## 🛠️ Tech Stack

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MySQL (`mysql2` connection pool)
* **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
* **Environment Handling**: `dotenv`

### Frontend
* **Build Tool**: Vite
* **Library**: React 18+
* **Styling**: Tailwind CSS v4
* **HTTP Client**: Axios
* **Icons**: Lucide React
* **Routing**: React Router DOM v6

---

## 📁 Project Structure

```text
task-management-system/
├── backend/
│   ├── src/
│   │   ├── config/       # Database connection & Admin seed
│   │   ├── controllers/  # Auth and Task business logic
│   │   ├── middleware/   # JWT authentication middleware
│   │   └── routes/       # Auth and Task routes
│   └── index.js          # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instance configuration
│   │   ├── pages/        # Login and Dashboard components
│   │   ├── App.jsx       # Route definitions & protection
│   │   └── main.jsx       # React entry point
└── README.md