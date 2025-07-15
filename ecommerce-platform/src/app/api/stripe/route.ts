import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const line_items = items.map((item: any) => ({
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
  } catch (error) {
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
}

// Stripe webhook handler for order creation
export async function handler(req: Request) {
  if (req.method !== 'POST') return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  const sig = req.headers.get('stripe-signature');
  let event;
  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const items = JSON.parse(session.metadata.items);
    await prisma.order.create({
      data: {
        total: session.amount_total / 100,
        status: 'paid',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        payment: {
          create: {
            provider: 'stripe',
            providerId: session.payment_intent,
            amount: session.amount_total / 100,
            status: 'paid',
          },
        },
      },
    });
  }
  return NextResponse.json({ received: true });
} 