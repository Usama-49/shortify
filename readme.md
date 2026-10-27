# ⚡ Shortify — Modern URL Shortener & Analytics Platform

> 🚀 **Under Active Development:** This project is currently being built from the ground up as a modern, high-performance URL shortener with real-time analytics and custom link management.

---

## 🌟 Overview

**Shortify** is a full-stack MERN application built with modern architecture and tools. It transforms long, cumbersome URLs into fast, trackable short links with custom aliases, expiration options, and detailed click analytics.

---

## 🛠️ Tech Stack

### **Backend** _(In Progress)_

- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Utilities:** `nanoid` (link generation), `cors`, `dotenv`

### **Frontend** _(In Progress)_

- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

---

## 🏗️ Getting Started (Local Development)

### **Prerequisites**

- **Node.js:** v18+
- **Database:** Local MongoDB instance or MongoDB Atlas URI

### **1. Clone the Repository**

git clone [https://github.com/usama-49/shortify.git](https://github.com/usamahere49/url-shortener.git)
cd shortify

### **2. Backend Setup**

cd backend
npm install

Create a `.env` file in the `backend/` root directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string

Run the development server with live reload:
npm run dev

---

## 📌 Roadmap & Features

- [x] TypeScript Express Backend Setup
- [x] Graceful Process Shutdown & Custom DNS Handlers
- [x] MongoDB Connection Lifecycle Management
- [ ] URL Shortener Schema & Controller Logic
- [ ] Custom Short Code & Expiration Handling
- [ ] Next.js Frontend Integration & Dashboard
- [ ] NextAuth Authentication (Google & GitHub)
- [ ] Click Analytics Tracking & Visual Charts

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Developed with ❤️ by **Usama**
