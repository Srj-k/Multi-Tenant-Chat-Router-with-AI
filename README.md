# Multi-Tenant Chat Router with AI

This project is a **Multi-Tenant Chat Routing System** designed for the **RateUp Full Stack Developer Technical Assessment**. The system demonstrates a backend-first approach to handling incoming customer messages, classifying their intent using AI, and routing conversations to the appropriate departments.

---

## Features

- Receive incoming customer messages via a webhook
- Support for multi-tenant businesses
- Intent classification using AI (planned)
- Scalable backend structure for future expansion
- Ready for real-time communication via WebSockets (planned)

---

## Tech Stack

**Backend**

- Node.js
- TypeScript
- Express.js
- CORS

**Frontend** (planned)

- React + TypeScript

**Database** (planned)

- SQLite with Prisma ORM

**Real-time Communication** (planned)

- WebSockets / Socket.io

**AI Integration** (planned)

- LLM-based intent classification

---

## Setup and Run

1. Clone the repository
2. Navigate to the backend folder

```
cd backend
```

3. Install dependencies

```
npm install
```

4. Start development server

```
npm run dev
```

## Current Progress

### Day 1 – Backend Foundation

- Initialized Node.js + TypeScript backend
- Configured Express server with CORS and JSON parsing
- Implemented `/webhook/message` endpoint to receive incoming messages
- Verified webhook functionality using Postman
- Structured project for scalability and maintainability

---

## Webhook Endpoint

**POST /webhook/message**

**Request Payload**

```json
{
  "businessId": "business_1",
  "message": "I want to know the price"
}
```

**Response**

```json
{
  "status": "Received"
}
```
