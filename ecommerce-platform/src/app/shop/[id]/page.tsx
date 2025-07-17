"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/CartContext";

type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  stock?: number;
  avgRating?: number;
  reviewCount?: number;
};
type Review = {
  id: string;
  rating: number;
  comment?: string;
  user?: { name?: string };
};
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    }
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch {}
    }
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-500">{error || "Product not found"}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 flex flex-col items-center">
      <Image src={product.imageUrl} alt={product.name} width={300} height={300} className="rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-2 text-blue-800">{product.name}</h1>
      <div className="text-green-600 text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>
      <p className="text-gray-600 mb-6 text-center">{product.description}</p>
      <button
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow mb-8"
        onClick={() => addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        })}
      >
        Add to Cart
      </button>
      {/* Reviews Section */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">User Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-gray-400 text-center">No reviews yet.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-500 font-bold">★</span>
                  <span className="font-semibold">{review.rating}</span>
                  <span className="text-gray-500 text-sm ml-2">by {review.user?.name || 'Anonymous'}</span>
                </div>
                <div className="text-gray-700">{review.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 