import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();
  const { rating, comment } = data;
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
  }
  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || review.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const updated = await prisma.review.update({
      where: { id },
      data: { rating, comment },
    });
    return NextResponse.json({ review: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || review.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
} 