"use client";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-50 p-4 flex flex-col sm:flex-row items-center justify-between border-t mt-8">
      <div className="text-blue-700 font-bold">ShopEase &copy; {new Date().getFullYear()}</div>
      <div className="flex gap-4 mt-2 sm:mt-0">
        <Link href="#" aria-label="Facebook"><FaFacebook className="text-xl text-blue-700 hover:text-blue-900" /></Link>
        <Link href="#" aria-label="Twitter"><FaTwitter className="text-xl text-blue-700 hover:text-blue-900" /></Link>
        <Link href="#" aria-label="Instagram"><FaInstagram className="text-xl text-blue-700 hover:text-blue-900" /></Link>
      </div>
    </footer>
  );
} 