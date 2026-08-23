# KrishiPlus

Agricultural marketplace platform.

## Tech Stack

- Node.js / Express
- MongoDB (Mongoose)
- JWT authentication

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and set your values.

3. Start the development server:

   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  config/       Database connection
  controllers/  Route handlers (stubs)
  middleware/   Auth & error handling
  models/       Mongoose models
  routes/       Express routers
  utils/        Helpers (ApiError, asyncHandler)
  server.js     App entry point
```

## Modules

| Module             | Model               | Route                  |
| ------------------ | ------------------- | ---------------------- |
| Buyers             | Buyer               | /api/buyers            |
| Buyer Verification | BuyerVerification   | /api/buyer-verifications |
| Offers             | Offer               | /api/offers            |
| Negotiation        | Negotiation         | /api/negotiations      |
| Contracts          | Contract            | /api/contracts         |
| Transactions       | Transaction         | /api/transactions      |
| Logistics          | Logistics           | /api/logistics         |
| Payments           | Payment             | /api/payments          |
| Trust              | Trust               | /api/trust             |
| Disputes           | Dispute             | /api/disputes          |

## Scripts

- `npm start` — run in production
- `npm run dev` — run with nodemon
- `npm test` — run tests