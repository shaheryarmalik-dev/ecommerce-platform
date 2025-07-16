import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Fetch user's cart
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let userId = session.user.id;
  if (!userId) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    userId = user?.id;
  }
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cart: {
        include: { items: { include: { product: true } } },
      },
    },
  });
  return NextResponse.json(user?.cart?.items || []);
}

// POST: Add or update cart item
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let userId = session.user.id;
  if (!userId) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    userId = user?.id;
  }
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { productId, quantity } = await req.json();
  if (!productId || !quantity) {
    return NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 });
  }
  // Find or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { user: { connect: { id: userId } } },
      include: { items: { include: { product: true } } },
    });
  }
  // Find if item exists
  const existing = cart.items.find((item: any) => item.productId === productId);
  let updatedCart;
  if (existing) {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
    });
  } else {
    // Add new item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }
  updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(updatedCart?.items || []);
}

// DELETE: Remove cart item
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let userId = session.user.id;
  if (!userId) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    userId = user?.id;
  }
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }
  // Find cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart) {
    return NextResponse.json([]);
  }
  // Find item
  const existing = cart.items.find((item: any) => item.productId === productId);
  if (existing) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
  }
  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(updatedCart?.items || []);
} 