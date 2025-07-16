import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');
  if (productId) {
    // Fetch all reviews for a product (public)
    try {
      const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      });
      return NextResponse.json({ reviews });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
} 