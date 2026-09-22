# 🚀 TaskMaster - Full-Stack Real-Time Task Management Application

TaskMaster is a modern, responsive, full-stack Task Management Web Application built with **Node.js, Express, SQLite, Socket.IO, React, and Vite**.

---

## ✨ Features

- 🔐 **User Authentication & Authorization**:
  - Secure Registration & Password Hashing using `bcryptjs`.
  - JWT (JSON Web Tokens) Bearer token authentication & route protection.
  - Persistent login sessions with automatic user verification.
  - Pre-seeded Demo account for instant test access (`demo@taskmaster.com` / `password123`).

- 📋 **Complete Task CRUD Operations**:
  - **Create**: Add tasks with Title, Description, Priority (*Low, Medium, High, Urgent*), Status (*To Do, In Progress, In Review, Completed*), Category (*Work, Personal, Urgent, Feature, Bug*), and Due Date.
  - **Read**: Full-text instant search, multi-field filter bar (Status, Priority, Category), and custom sorting (*Created Date, Due Date, Priority*).
  - **Update**: Modal dialog editing, quick status selector, and drag-&-drop Kanban column movements.
  - **Delete**: Task deletion with confirmation prompts.

- ⚡ **Real-Time WebSockets Sync (Socket.IO)**:
  - Instant multi-browser & multi-tab synchronization (`task:created`, `task:updated`, `task:status_changed`, `task:deleted`).
  - Live Connection Status indicator ("● Live Sync Active").
  - Non-intrusive toast notifications when tasks are updated live.

- 🎨 **Responsive UI & UX**:
  - **Kanban Board View**: Drag-and-drop columns with task counters.
  - **List View**: Detailed tabular view with sortable columns and quick status dropdowns.
  - **Analytics Dashboard**: Interactive completion progress bar, task status distribution, and priority charts.
  - **Light / Dark Mode**: Theme switcher with persisted preferences.
  - Fully responsive layout optimized for Desktop, Tablet, and Mobile viewports.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom Utility CSS System with CSS Custom Properties.
- **Backend**: Node.js, Express.js, Socket.IO.
- **Database**: SQLite3 (`tasks.db`) with automatic table creation & demo data seeding.
- **Authentication**: JWT (jsonwebtoken) & bcryptjs.

---

## 💻 How to Run the Application

### 1. Open Project in VS Code
Open VS Code and set the workspace folder to:
```
C:\Users\Kamal\.gemini\antigravity\scratch\task-management-app
```

### 2. Install Dependencies
Run from the root directory:
```bash
npm run install-all
```
*(Or install `server` and `client` individually: `cd server && npm install`, `cd ../client && npm install`)*

### 3. Start Development Server
From the root directory, run:
```bash
npm run dev
```

- **Backend API & WebSockets Server**: Running on `http://localhost:5000`
- **Frontend Vite Client App**: Running on `http://localhost:3000`

---

## 🧪 Quick Test Credentials

- **Email**: `demo@taskmaster.com`
- **Password**: `password123`
- *Or register a new account on the login page!*
