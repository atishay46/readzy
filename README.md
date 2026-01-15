# Readzy

Readzy is a full-stack personal reading management application that allows users to organize their digital book library and manage a limited “currently reading” list using Least Recently Used (LRU) logic.

The application models real-world reading behavior, where users may own many books but can actively read only a few at a time.

---

## Features

### Authentication
- User signup and login using JWT-based authentication
- Secure, user-specific data isolation
- Protected routes for authenticated users

### Library Management
- Add books using Google Drive PDF links
- Store only book metadata (no file hosting)
- Search books by title
- Delete books manually

### Currently Reading (LRU-Based)
- Maximum of three active reading slots per user
- Reading a book marks it as active and updates its last access time
- When the limit is exceeded, the least recently read book is automatically deactivated
- Deactivated books remain in the library and can be reactivated at any time

### Data Persistence
- MongoDB used for persistent storage
- User-specific book collections
- LRU state preserved across server restarts

---

## Tech Stack

### Frontend
- React.js (Vite)
- TypeScript
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT authentication
- Docker

---

## How LRU Logic Works

- Each book stores a `lastReadAt` timestamp
- Active books are limited to three per user
- When a fourth book is read:
  - The book with the oldest `lastReadAt` value is deactivated
  - No data is deleted
- LRU logic is applied independently for each user

-License

This project is for educational and portfolio purposes.

