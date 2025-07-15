import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Order Cancelled</h1>
      <p className="text-lg text-gray-700 mb-8">Your payment was cancelled or failed. No charges were made.</p>
      <Link href="/checkout" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-lg font-semibold">Try Again</Link>
    </div>
  );
} 