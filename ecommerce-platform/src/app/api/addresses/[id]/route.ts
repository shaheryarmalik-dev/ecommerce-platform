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
  const { fullName, line1, line2, city, state, postalCode, country, phone, isDefault } = data;
  if (!fullName || !line1 || !city || !state || !postalCode || !country) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || address.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // If isDefault, unset previous default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }
    const updated = await prisma.address.update({
      where: { id },
      data: {
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
    return NextResponse.json({ address: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  try {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || address.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
} 