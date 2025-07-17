"use client";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";
import { useSession, signOut } from "next-auth/react";
import { useWishlist } from "@/components/WishlistContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { data: session } = useSession();
  const { items: wishlist } = useWishlist();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b bg-white shadow-md backdrop-blur">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="var(--color-primary)"/>
              <path d="M12 24c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="14" r="4" fill="#fff"/>
            </svg>
          </span>
          <span className="text-2xl font-bold text-blue-700 tracking-tight">ShopEase</span>
        </Link>
      </div>
      <nav className="hidden md:flex gap-8 text-base font-medium text-gray-700">
        <Link href="/shop" className="hover:text-blue-700 transition">Shop</Link>
      </nav>
      <div className="flex items-center gap-4">
        {/* Home Icon */}
        <Link href="/" title="Home" className="group">
          <HomeIcon className="w-7 h-7 text-gray-400 group-hover:text-blue-600 transition" />
        </Link>
        {/* Wishlist Icon with Badge (only if logged in) */}
        {session && session.user && (
          <Link href="/profile" title="Wishlist" className="relative group">
            <HeartIcon className="w-7 h-7 text-gray-400 group-hover:text-red-500 transition" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow">{wishlist.length}</span>
            )}
          </Link>
        )}
        {/* User menu if logged in, else show Login/Sign Up */}
        {session && session.user ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 focus:outline-none">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                {session?.user?.name ? session.user.name[0] : <UserIcon className="w-5 h-5" />}
              </span>
            </Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a href="/profile" className={`group flex rounded-md items-center w-full px-2 py-2 text-sm ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>Profile</a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a href="/profile" className={`group flex rounded-md items-center w-full px-2 py-2 text-sm ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>Orders</a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={() => signOut()} className={`group flex rounded-md items-center w-full px-2 py-2 text-sm ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>Logout</button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded block">
              Login
            </Link>
            <Link href="/signup" className="bg-gray-200 text-blue-700 px-4 py-2 rounded block">
              Sign Up
            </Link>
          </div>
        )}
        <CartIcon />
      </div>
    </header>
  );
} 