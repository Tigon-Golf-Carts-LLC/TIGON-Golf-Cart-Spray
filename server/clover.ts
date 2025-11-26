import axios from 'axios';

// Clover API Configuration
const CLOVER_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';

const CLOVER_BASE_URLS = {
  sandbox: {
    api: 'https://scl-sandbox.dev.clover.com',
    token: 'https://token-sandbox.dev.clover.com',
    sdk: 'https://checkout.sandbox.dev.clover.com/sdk.js',
  },
  production: {
    api: 'https://scl.clover.com',
    token: 'https://token.clover.com',
    sdk: 'https://checkout.clover.com/sdk.js',
  },
};

const urls = CLOVER_BASE_URLS[CLOVER_ENV];

// Check if Clover is configured
export function isCloverConfigured(): boolean {
  return !!(
    process.env.CLOVER_PRIVATE_TOKEN &&
    process.env.CLOVER_PUBLIC_TOKEN &&
    process.env.CLOVER_MERCHANT_ID
  );
}

// Get Clover public configuration (safe for frontend)
export function getCloverPublicConfig() {
  return {
    configured: isCloverConfigured(),
    publicToken: process.env.CLOVER_PUBLIC_TOKEN || '',
    merchantId: process.env.CLOVER_MERCHANT_ID || '',
    sdkUrl: urls.sdk,
    environment: CLOVER_ENV,
  };
}

// Create a charge using Clover API
export async function createCharge(params: {
  source: string; // Token from frontend
  amount: number; // Amount in cents
  currency?: string;
  description?: string;
  orderId?: string;
  customerEmail?: string;
}) {
  if (!isCloverConfigured()) {
    throw new Error('Clover is not configured. Please add CLOVER_PRIVATE_TOKEN, CLOVER_PUBLIC_TOKEN, and CLOVER_MERCHANT_ID.');
  }

  const { source, amount, currency = 'usd', description, orderId, customerEmail } = params;

  try {
    const response = await axios.post(
      `${urls.api}/v1/charges`,
      {
        amount,
        currency,
        source,
        description: description || `Order ${orderId}`,
        receipt_email: customerEmail,
        metadata: orderId ? { order_id: orderId } : undefined,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOVER_PRIVATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      chargeId: response.data.id,
      status: response.data.status,
      amount: response.data.amount,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Clover charge error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Payment failed',
    };
  }
}

// Refund a charge
export async function refundCharge(chargeId: string, amount?: number) {
  if (!isCloverConfigured()) {
    throw new Error('Clover is not configured');
  }

  try {
    const payload: any = {};
    if (amount) payload.amount = amount;

    const response = await axios.post(
      `${urls.api}/v1/charges/${chargeId}/refunds`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOVER_PRIVATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      refundId: response.data.id,
      status: response.data.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Clover refund error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Refund failed',
    };
  }
}

// Get charge details
export async function getCharge(chargeId: string) {
  if (!isCloverConfigured()) {
    throw new Error('Clover is not configured');
  }

  try {
    const response = await axios.get(
      `${urls.api}/v1/charges/${chargeId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOVER_PRIVATE_TOKEN}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Clover get charge error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

// Test card numbers for sandbox
export const CLOVER_TEST_CARDS = {
  visa: '4005571702222222',
  mastercard: '5496198584584769',
  discover: '6011361000006668',
  amex: '345678000000007',
};
