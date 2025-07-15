import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const data = await req.json();
  const { type, cardBrand, cardLast4, cardExpMonth, cardExpYear, paypalEmail, isDefault } = data;
  if (!type || (type === 'card' && (!cardBrand || !cardLast4 || !cardExpMonth || !cardExpYear)) || (type === 'paypal' && !paypalEmail)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });
    if (!paymentMethod) return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || paymentMethod.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // If isDefault, unset previous default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }
    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: {
        type,
        cardBrand,
        cardLast4,
        cardExpMonth,
        cardExpYear,
        paypalEmail,
        isDefault: !!isDefault,
      },
    });
    return NextResponse.json({ paymentMethod: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });
    if (!paymentMethod) return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || paymentMethod.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.paymentMethod.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
} 