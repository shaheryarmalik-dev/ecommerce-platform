import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const line_items = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        items: JSON.stringify(items),
      },
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
} 