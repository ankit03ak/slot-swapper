# SlotSwapper 
SlotSwapper is a **peer-to-peer time-slot swapping platform** that allows users to create events, mark them as *swappable*, and exchange time slots with other users.

## 🧠 Overview & Design Choices

### 🎯 Core Idea
Users manage their calendar events.  
If a user marks an event as **swappable**, others can request to exchange one of their own swappable slots for it.  
Requests can be accepted or rejected, and calendars update automatically.

## Quick Start
1. `npm install`
2. Copy `.env.example` to `.env` and fill values.
3. `npm run dev`
4. Health check: `GET /api/health`

> Transactions are used for swap acceptance. Use MongoDB Atlas or enable a single-node replica set locally.

## Core Endpoints

Auth:
- `POST /api/auth/signup` `{name,email,password}`
- `POST /api/auth/login` `{email,password}`

Events (Authorization: `Bearer <token>`):
- `POST /api/events`
- `GET /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

Swap:
- `GET /api/swappable-slots`
- `POST /api/swap-request` `{ mySlotId, theirSlotId }`
- `POST /api/swap-response/:requestId` `{ accept: true|false }`
- `GET /api/requests` (incoming/outgoing)

Event Status: `BUSY | SWAPPABLE | SWAP_PENDING`  
Swap Status: `PENDING | ACCEPTED | REJECTED | CANCELLED`

## Notes
- When `POST /api/swap-request` is called, both events are atomically set to `SWAP_PENDING` and a `PENDING` SwapRequest is created.
- On response:
  - **Reject**: SwapRequest -> `REJECTED`; both events -> `SWAPPABLE`
  - **Accept**: SwapRequest -> `ACCEPTED`; exchange `userId` of events; both -> `BUSY`




## ⚙️ Setup & Run Locally

### 1️⃣ Clone the Project
```bash
git clone https://github.com/your-username/slotswapper.git
cd slotswapper


cd slot-api
npm install

### Create a .env

PORT=8080
MONGO_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_secret_key

# Run backend:
npm run dev

#Setup Frontend (slot-client)
cd ../slot-client
npm install

# Run frontend:
npm run dev






