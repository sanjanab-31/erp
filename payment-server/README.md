# Payment Server

Stripe payment processing server for the ERP system.

## Features

- ✅ Stripe Checkout (redirect-based payments)
- ✅ Payment Intents (embedded card forms)
- ✅ Payment verification
- ✅ Webhook support
- ✅ Test mode ready

## Environment Variables

The server reads from the root `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
PORT=4242
```

## API Endpoints

### Health Check
```
GET /health
```

### Create Checkout Session
```
POST /create-checkout-session
Body: {
  amount: number,
  currency: string (default: 'inr'),
  feeId: string,
  studentName: string,
  feeType: string
}
```

### Get Checkout Session
```
GET /checkout-session/:sessionId
```

### Create Payment Intent
```
POST /create-payment-intent
Body: {
  amount: number,
  currency: string (default: 'inr'),
  feeId: string,
  studentName: string,
  feeType: string
}
```

### Verify Payment
```
POST /verify-payment
Body: {
  paymentIntentId: string
}
```

### Get Payment Details
```
GET /payment/:paymentIntentId
```

### Webhook (Production)
```
POST /webhook
```

## Running

```bash
# Install dependencies
npm install

# Start server
npm start

# Or for development
npm run dev
```

Server will run on port 4242 (or PORT from .env)

## Security

- Never commit the `.env` file
- Use test keys for development
- Enable webhook signature verification in production
- Use HTTPS in production
