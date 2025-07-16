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
    const addresses = await prisma.address.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { isDefault: 'desc', updatedAt: 'desc' },
    });
    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const { fullName, line1, line2, city, state, postalCode, country, phone, isDefault } = data;
  if (!fullName || !line1 || !city || !state || !postalCode || !country) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    // If isDefault, unset previous default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { user: { email: session.user.email }, isDefault: true },
        data: { isDefault: false },
      });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: !!isDefault,
      },
    });
    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
} 