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

## Day 1 – Backend Foundation

- Initialized Node.js + TypeScript backend
- Configured Express server with CORS and JSON parsing
- Implemented `/webhook/message` endpoint to receive incoming messages
- Verified webhook functionality using Postman
- Structured project for scalability and maintainability

---

## Day 2 - Prisma, SQLite, and multi-tenant schema

- Integrated Prisma ORM with SQLite
- Designed multi-tenant database schema
- Added message persistence
- Centralized Prisma client
- Prepared database for AI routing logic

---

## Database Schema

This schema design represents mulit-tenant business model where each business can manage its own conversations

### Entity Relationships

- A **Business** can have multiple **Conversations**
- A **Business** can have multiple **Departments**
- A **Conversation** can have multiple **Messages**
- Each **Message** belongs to a single **Business**

### Prisma Schema

```prisma
model Business {
  id          String         @id @default(uuid())
  name        String
  departments Department[]
  chats       Conversation[]
  users       User[]
  createdAt   DateTime       @default(now())
}

model Department {
  id         String         @id @default(uuid())
  name       String
  businessId String
  business   Business       @relation(fields: [businessId], references: [id])
  chats      Conversation[]
  users      User[]
  createdAt  DateTime       @default(now())
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  role         UserType
  businessId   String
  departmentId String?

  business   Business    @relation(fields: [businessId], references: [id])
  department Department? @relation(fields: [departmentId], references: [id])

  conversations Conversation[] @relation("AgentConversations")
}

model Conversation {
  id              String             @id @default(uuid())
  businessId      String
  departmentId    String?
  assignedAgentId String?
  status          ConversationStatus

  business      Business    @relation(fields: [businessId], references: [id])
  department    Department? @relation(fields: [departmentId], references: [id])
  assignedAgent User?       @relation("AgentConversations", fields: [assignedAgentId], references: [id])

  messages  Message[]
  createdAt DateTime  @default(now())
}

model Message {
  id             String     @id @default(uuid())
  conversationId String
  sender         SenderType
  content        String

  conversation Conversation @relation(fields: [conversationId], references: [id])
  createdAt    DateTime     @default(now())
}
```

## Day 3 - AI Routing and Message Flow

- Implemented AI-based intent classification service

- Automatically routes incoming messages to the correct department

- Created a central routing layer decoupled from controllers

- Added fallback routing for unknown intents

### AI Routing Flow

```
Incoming Message
        ↓
Persist Message
        ↓
AI Intent Classification
        ↓
Department Mapping
        ↓
Conversation Assignment
```

### AI Intent Classification

- Uses Google Gemini API
- Divides into Sales, Support, Billing or General
- If confidence is low falls back to General department

## Day 4 - Admin and Agent Dashboard

### Admin Capabilities

- View all conversations for a business
- View messages inside any conversation
- Monitor department-wise traffic
- Multi-tenant isolation enforced at API level

### Mock Message API

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/api/messages` | Client sends message to app |

### Admin Routes

| Method | Endpoint                                            | Description                                   |
| ------ | --------------------------------------------------- | --------------------------------------------- |
| GET    | `/api/admin/conversations`                          | List all conversations for the business       |
| GET    | `/api/admin/conversations/:conversationId`          | Get messages for a specific conversation      |
| GET    | `/api/admin/agents`                                 | List all agents in the business               |
| GET    | `/api/admin/departments`                            | List departments with conversation counts     |
| PATCH  | `/api/admin/conversations/:conversationId/reassign` | Reassign a conversation to another department |

### Agent Capabilities

- View conversations assigned to their department
- Read messages in real time (WebSocket-ready)
- Reply to customer messages

### Agent Routes

## Agent API Endpoints

| Method | Endpoint                                    | Description                                   |
| ------ | ------------------------------------------- | --------------------------------------------- |
| GET    | `/api/agent/chats`                          | List all conversations for agent’s department |
| GET    | `/api/agent/chats/:conversationId`          | Get messages for a specific conversation      |
| POST   | `/api/agent/chats/:conversationId/messages` | Send a message in a conversation              |
| PATCH  | `/api/agent/chats/:conversationId/close`    | To close a chat                               |

### Authentication & Authorization (Mocked)

- Authentication is mocked for assessment simplicity
- Roles Supported
  - Admin
  - Agent
- Role-Based Access Control
- Middleware enforces role checks
