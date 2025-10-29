# MERN URL Shortener – Backend API

Backend service for the MERN URL shortener app. Handles user authentication, Google OAuth, short link generation, redirection, usage analytics, and user dashboards.

## ✅ Why I Built This
To learn how short URL systems work internally, including unique IDs, fast redirects, analytics tracking, JWT auth, and OAuth integration.

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **OAuth:** Google OAuth login
- **Deployment:** Heroku
- **Other Libraries**
  - Google OAuth SDK (if used)
  - CORS, Helmet for security
  - Analytics middleware for counting link clicks

## ✨ Features
- ✅ Register & login (JWT)  
- ✅ Login with Google OAuth  
- ✅ Create and manage short URLs  
- ✅ Server-side redirect logic  
- ✅ Track visits/click analytics  
- ✅ Only logged-in users can manage their links
