import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { isDefault: 'desc', updatedAt: 'desc' },
    });
    return NextResponse.json({ paymentMethods });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const { type, cardBrand, cardLast4, cardExpMonth, cardExpYear, paypalEmail, isDefault } = data;
  if (!type || (type === 'card' && (!cardBrand || !cardLast4 || !cardExpMonth || !cardExpYear)) || (type === 'paypal' && !paypalEmail)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    // If isDefault, unset previous default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { user: { email: session.user.email }, isDefault: true },
        data: { isDefault: false },
      });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        type,
        cardBrand,
        cardLast4,
        cardExpMonth,
        cardExpYear,
        paypalEmail,
        isDefault: !!isDefault,
      },
    });
    return NextResponse.json({ paymentMethod }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add payment method' }, { status: 500 });
  }
} 