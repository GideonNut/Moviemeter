# AI Recommendations Paywall System

This system implements a paywall for AI movie recommendations using thirdweb and CELO blockchain payments.

## Overview

The paywall system consists of several components that work together to provide a seamless payment experience:

- **AI Paywall Component**: Modal that appears when users try to access AI recommendations
- **Payment Configuration**: Centralized configuration for payment amounts, contract details, and messages
- **API Integration**: Backend endpoints that check payment status and mark users as paid
- **Payment Tracking**: In-memory store (can be replaced with database) to track paid users

## Components

### 1. AI Paywall (`components/ai-paywall.tsx`)

A modal component that:
- Shows when users try to access AI recommendations without payment
- Displays payment amount (50 CELO) and features
- Handles wallet connection and payment processing
- Provides user feedback during payment process

**Key Features:**
- Responsive design with smooth animations
- Error handling for failed payments
- Integration with thirdweb wallet system
- Automatic API call to mark user as paid after successful payment

### 2. Payment Configuration (`lib/payment-config.ts`)

Centralized configuration including:
- Payment amount (50 CELO = 50 * 10^18 wei)
- Payment recipient address (0xD2651cd396DFBfab5EB04788C176BB5fE9018E44)
- Feature descriptions for the paywall
- Payment status messages
- Utility functions for validation and formatting

### 3. API Integration (`app/api/movies/recommendations/route.ts`)

Enhanced API endpoints:
- **POST**: Checks payment status before returning recommendations
- **PUT**: Marks user as paid after successful payment
- Returns 402 (Payment Required) status for unpaid users

### 4. Recommendations Page (`app/recommendations/page.tsx`)

Updated page that:
- Integrates the paywall component
- Checks payment status before showing recommendations
- Automatically fetches recommendations after successful payment
- Provides smooth user experience

## Payment Flow

1. **User Access**: User tries to get AI recommendations
2. **Payment Check**: System checks if user has paid
3. **Paywall Display**: If unpaid, paywall modal appears
4. **Wallet Connection**: User connects wallet (if not already connected)
5. **Payment Processing**: User pays 50 CELO via blockchain transaction
6. **Payment Verification**: System marks user as paid
7. **Recommendations**: AI recommendations are displayed

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

### Payment Settings

```typescript
// In lib/payment-config.ts
export const PAYMENT_AMOUNT_CELO = 50 // 50 CELO
export const PAYMENT_RECIPIENT_ADDRESS = "0xD2651cd396DFBfab5EB04788C176BB5fE9018E44"
```

## Testing

Use the test utilities in `lib/payment-test.ts`:

```typescript
import { testPaymentFlow } from "@/lib/payment-test"

// Test payment flow
const success = await testPaymentFlow("0x1234...")
console.log("Payment test:", success)
```

## Production Considerations

### Database Integration

Replace the in-memory `paidUsers` Set with a proper database:

```typescript
// Example with MongoDB
const paidUser = await PaidUsers.findOne({ walletAddress: address.toLowerCase() })
if (paidUser) {
  // User has paid
}
```

### Blockchain Verification

Add proper blockchain verification for payments:

```typescript
// Verify payment on blockchain
const receipt = await getTransactionReceipt(transactionHash)
if (receipt.status === 'success') {
  // Mark user as paid
}
```

### Error Handling

Enhance error handling for:
- Insufficient funds
- Network issues
- Transaction failures
- Wallet connection problems

## Security Considerations

1. **Payment Verification**: Always verify payments on blockchain
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Validate all user inputs
4. **Error Messages**: Don't expose sensitive information in error messages

## Usage

The paywall automatically appears when users try to access AI recommendations. No additional setup is required beyond the initial configuration.

## Troubleshooting

### Common Issues

1. **Payment Failed**: Check wallet balance and network connection
2. **Wallet Not Connected**: Ensure thirdweb is properly configured
3. **API Errors**: Check backend logs and payment status

### Debug Mode

Enable debug logging:

```typescript
// In components/ai-paywall.tsx
console.log("Payment transaction:", transaction)
console.log("Payment result:", result)
```

## Future Enhancements

1. **Subscription Model**: Monthly/yearly payment plans
2. **Free Tier**: Limited free recommendations per user
3. **Referral System**: Free recommendations for referrals
4. **Payment History**: Track user payment history
5. **Refund System**: Handle payment disputes and refunds
