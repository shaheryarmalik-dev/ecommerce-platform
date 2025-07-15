import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Thank you for your order!</h1>
      <p className="text-lg text-gray-700 mb-8">Your order has been received and is being processed.</p>
      <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-lg font-semibold">Return to Shop</Link>
    </div>
  );
} 