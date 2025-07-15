import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wishlist: true },
  });
  return NextResponse.json(user?.wishlist || []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { productId } = await req.json();
  console.log("Received productId:", productId);
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      wishlist: {
        connect: { id: productId },
      },
    },
    include: { wishlist: true },
  });
  return NextResponse.json(user.wishlist);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      wishlist: {
        disconnect: { id: productId },
      },
    },
    include: { wishlist: true },
  });
  return NextResponse.json(user.wishlist);
} 