import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: true,
      },
    });
    // Add average rating and review count to each product
    const productsWithReviewStats = products.map((product: any) => {
      const reviewCount = product.reviews.length;
      const avgRating = reviewCount > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
      return {
        ...product,
        reviewCount,
        avgRating,
      };
    });
    return NextResponse.json(productsWithReviewStats);
  } catch (error) {
    console.error("PRODUCTS API ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}