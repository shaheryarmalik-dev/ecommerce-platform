import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { notifyEmail: true, notifySMS: true, language: true, theme: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const { notifyEmail, notifySMS, language, theme } = data;
  if (
    (notifyEmail !== undefined && typeof notifyEmail !== 'boolean') ||
    (notifySMS !== undefined && typeof notifySMS !== 'boolean') ||
    (language !== undefined && typeof language !== 'string') ||
    (theme !== undefined && typeof theme !== 'string')
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(notifyEmail !== undefined ? { notifyEmail } : {}),
        ...(notifySMS !== undefined ? { notifySMS } : {}),
        ...(language !== undefined ? { language } : {}),
        ...(theme !== undefined ? { theme } : {}),
      },
      select: { notifyEmail: true, notifySMS: true, language: true, theme: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
} 