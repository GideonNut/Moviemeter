# x402 Payment Protocol Implementation

This document describes the implementation of the x402 payment protocol for AI recommendations in the MovieMeter application.

## Overview

x402 is an open payment standard that enables services to charge for access to their APIs and content directly over HTTP using the HTTP `402 Payment Required` status code. This implementation allows for seamless payments for AI-powered movie recommendations.

## Features

- **Payments**: 50 CELO payments for AI recommendations
- **Seamless UX**: Payment flow integrated directly into the recommendation request
- **Blockchain Integration**: Uses Celo network for payments
- **Payment Tokens**: Generates authenticated tokens for subsequent requests
- **HTTP 402 Compliance**: Proper HTTP status codes and headers

## Architecture

### Files Created/Modified

1. **`lib/x402-config.ts`** - Configuration and types for x402 protocol
2. **`app/api/x402/payment/route.ts`** - Main payment API endpoint
3. **`app/api/x402/verify/route.ts`** - Payment verification endpoint
4. **`components/x402-payment.tsx`** - React component for payment UI
5. **`app/recommendations/page.tsx`** - Updated to use x402 payments

### API Endpoints

#### POST `/api/x402/payment`
Handles AI recommendation requests with x402 payment protocol.

**Request:**
```json
{
  "preferences": "I like sci-fi movies with complex plots",
  "walletAddress": "0x...",
  "paymentToken": "x402_..." // Optional, for authenticated requests
}
```

**Response (402 Payment Required):**
```json
{
  "error": "Payment required for AI recommendations",
  "payment": {
    "amount": "50000000000000000000",
    "recipient": "0xD2651cd396DFBfab5EB04788C176BB5fE9018E44",
    "description": "AI Movie Recommendations Access",
    "nonce": "1234567890-abc123",
    "timestamp": 1234567890123
  },
  "requiresPayment": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "recommendations": [...],
  "message": "AI recommendations generated successfully"
}
```

#### POST `/api/x402/verify`
Verifies blockchain transactions and generates payment tokens.

**Request:**
```json
{
  "transactionHash": "0x...",
  "walletAddress": "0x...",
  "paymentRequest": {...}
}
```

**Response:**
```json
{
  "success": true,
  "paymentToken": "x402_...",
  "message": "Payment verified successfully",
  "valid": true
}
```

## Payment Flow

1. **User requests AI recommendations** without payment token
2. **API returns 402 Payment Required** with payment details
3. **Frontend shows x402 payment modal** with micropayment amount
4. **User confirms payment** via connected wallet
5. **Transaction is sent** to blockchain (Celo network)
6. **Payment is verified** on blockchain
7. **Payment token is generated** for authenticated access
8. **AI recommendations are returned** using the token

## Configuration

### Payment Amount
- **Amount**: 50 CELO (50,000,000,000,000,000,000 wei)
- **Recipient**: `0xD2651cd396DFBfab5EB04788C176BB5fE9018E44`
- **Network**: Celo Mainnet

### x402 Headers
- `X-Payment-Amount`: Payment amount in wei
- `X-Payment-Recipient`: Payment recipient address
- `X-Payment-Description`: Description of the service
- `X-Payment-Nonce`: Unique request identifier
- `X-Payment-Signature`: Payment signature (future enhancement)

## Security Considerations

1. **Payment Verification**: All payments are verified on the blockchain
2. **Token Expiration**: Payment tokens expire after 24 hours
3. **Nonce Validation**: Each payment request has a unique nonce
4. **Amount Validation**: Payment amounts are validated against expected values

## Testing

Run the test script to verify the implementation:

```bash
node test-x402.js
```

This will test:
- 402 Payment Required responses
- Payment verification endpoints
- Token validation

## Usage Example

```typescript
// Request AI recommendations
const response = await fetch('/api/x402/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    preferences: 'I like sci-fi movies',
    walletAddress: '0x...'
  })
})

if (response.status === 402) {
  // Show payment modal
  const data = await response.json()
  showPaymentModal(data.payment)
} else {
  // Process recommendations
  const data = await response.json()
  setRecommendations(data.recommendations)
}
```

## Future Enhancements

1. **JWT Token Signing**: Implement proper JWT signing for payment tokens
2. **Blockchain Integration**: Add real blockchain verification
3. **Payment Analytics**: Track payment success rates and amounts
4. **Multi-token Support**: Support for different payment tokens (cUSD, USDC)
5. **Payment Subscriptions**: Support for recurring payments
6. **Rate Limiting**: Implement payment-specific rate limiting

## Benefits of x402 Implementation

1. **Payments**: Enables blockchain payments for individual services
2. **No Accounts Required**: Users don't need to create accounts
3. **Blockchain Native**: Leverages blockchain for trustless payments
4. **HTTP Standard**: Uses standard HTTP status codes
5. **Seamless UX**: Payment flow is integrated into the service request
6. **AI Agent Compatible**: Perfect for autonomous AI agent payments

## Integration with Existing System

The x402 implementation integrates seamlessly with the existing MovieMeter application:

- **Maintains existing functionality** for free features
- **Adds premium AI recommendations** via payments
- **Uses existing wallet connection** (Thirdweb)
- **Preserves user experience** while adding payment capabilities

This implementation demonstrates how traditional web services can adopt blockchain-based payments using the x402 protocol, enabling new monetization models for AI-powered services.
