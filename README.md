# 🕸️ Connectly  
> **Connectly** is a full-stack social media web application where users can connect, post content, chat in real time, and engage with each other through likes, comments, and follows — built using the **MERN (MongoDB, Express, React, Node.js)** stack with **Socket.IO** for live messaging and **Cloudinary** for media uploads.

---

## 📚 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Directory Structure](#directory-structure)
5. [Setup Instructions](#setup-instructions)
6. [Environment Variables](#environment-variables)
7. [Author](#author)

---

## 🧩 Overview
Connectly provides a modern social experience similar to Instagram or Twitter — users can sign up, create posts, like/comment, and chat in real time. The project is split into **frontend** and **backend** directories, allowing clear separation of concerns.

---

## ✨ Features
- 🔐 User authentication (signup/login with JWT)
- 📝 Create, delete, and like posts
- 💬 Real-time chat using **Socket.IO**
- 💭 Comment system on posts
- 🧑‍🤝‍🧑 Follow / unfollow users
- 📸 Image upload with **Cloudinary**
- 🧾 Toast notifications and modals for UI feedback
- 🧭 Protected routes for authenticated users
- ⚙️ Centralized state management with **Redux Toolkit**
- 💾 MongoDB database for persistence

---

## 🧰 Tech Stack

### Frontend
- ⚛️ **React (Vite)**
- 🧭 **React Router**
- ⚡ **Redux Toolkit**
- 🧩 **Axios** for API calls
- 💬 **Socket.IO Client**
- 🎨 **Tailwind**


### Backend
- 🟢 **Node.js / Express.js**
- 🍃 **MongoDB + Mongoose**
- 🔒 **JWT Authentication**
- ☁️ **Cloudinary** for image storage
- 💬 **Socket.IO** for real-time chat
- 🧰 **Multer** for file handling
- ⚙️ **Custom Middleware** (auth, error handling)

---

## 📂 Directory Structure

```
connectly/
├── backend/
│   ├── index.js                 # Entry point
│   ├── package.json
│   ├── controllers/             # Handles business logic
│   │   ├── messageController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── middleware/              # Reusable middlewares
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── multerMiddleware.js
│   ├── models/                  # Mongoose models
│   │   ├── Comment.js
│   │   ├── Conversation.js
│   │   ├── Like.js
│   │   ├── Message.js
│   │   ├── Post.js
│   │   ├── Subscription.js
│   │   └── User.js
│   ├── routes/                  # API routes
│   │   ├── messageRoute.js
│   │   ├── postRoute.js
│   │   └── userRoute.js
│   ├── socket/                  # Socket.IO setup
│   │   └── socket.js
│   └── utils/                   # Helper utilities
│       ├── cloudinary.js
│       ├── db.js
│       ├── feature.js
│       └── handler.js
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── socket.jsx
    │   ├── components/          # Reusable UI components
    │   │   ├── Avatar.jsx
    │   │   ├── Feed.jsx
    │   │   ├── ChatPage.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── EditProfile.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── shared/Modal.jsx
    │   │   └── shared/Toast.jsx
    │   ├── hooks/               # Custom hooks for API and logic
    │   ├── context/             # Context API (Toast notifications)
    │   ├── redux/               # Redux store and slices
    │   └── utils/               # Helpers (API paths, axios config)
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rajat-sharma-3745/Connectly.git
cd Connectly
```

### 2️⃣ Backend setup
```bash
cd backend
npm install
```

Create a `.env` file (see next section).

Start the server:
```bash
npm run dev
```

### 3️⃣ Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```


---

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```
---

## 👨‍💻 Author
**Rajat Sharma**  
🔗 [GitHub Profile](https://github.com/rajat-sharma-3745)
