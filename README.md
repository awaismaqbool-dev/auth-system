# MERN Authentication System

A complete and secure authentication system built with Node.js, Express, and MongoDB.
This project covers real-world auth features like OTP verification, JWT authentication, and protected routes.

A complete authentication system with:
- User registration with email
- User Login
- Email OTP verification
- Secure login with JWT
- Protected routes
- Password hashing

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT
- Nodemailer
- HTML, CSS, JavaScript

## Features
- Secure user registration
- Login with email & password
- OTP verification via email
- Protected routes using JWT

## Demo Video
👉 [Screen Recording Link Here]
- User registration
- OTP received on email
- OTP verification
- Login
- Accessing protected routes

## Project Structure

auth-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── index.html
│
├── .gitignore
├── README.md
└── package.json

## Environment Variables

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
SMTP_USER=your_email_username
SMTP_PASS=your_email_password
SENDER_EMAIL=your_email_address


## How to Run Project
1. Clone the repo
2. Install dependencies
   npm install
3. Create .env file
4. Run project
   npm start

## Security Notes

- Passwords are hashed before saving
- JWT is used for authentication
- Sensitive data is stored in .env file

## Author

# Awais Maqbool
- Full Stack Developer (MERN)
- GitHub: add your GitHub link