import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // In a real app, use the PayPal REST SDK and authenticate with client ID/secret
    // Here, just return a mock order ID for demo purposes
    return NextResponse.json({ orderID: 'MOCK_PAYPAL_ORDER_ID' });
  } catch {
    return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 500 });
  }
} 