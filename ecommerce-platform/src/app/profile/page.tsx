"use client";
import { useState } from "react";
import { UserCircleIcon, ShoppingBagIcon, MapPinIcon, CreditCardIcon, Cog6ToothIcon, HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/components/WishlistContext";
import OrderHistory from "@/components/OrderHistory";
import AddressBook from "@/components/AddressBook";
import PaymentMethods from "@/components/PaymentMethods";
import AccountSettings from "@/components/AccountSettings";
import Reviews from "@/components/Reviews";

const sections = [
  { key: "profile", label: "Profile Overview", icon: UserCircleIcon },
  { key: "orders", label: "Order History", icon: ShoppingBagIcon },
  { key: "addresses", label: "Address Book", icon: MapPinIcon },
  { key: "payments", label: "Payment Methods", icon: CreditCardIcon },
  { key: "settings", label: "Account Settings", icon: Cog6ToothIcon },
  { key: "wishlist", label: "Wishlist", icon: HeartIcon },
  { key: "reviews", label: "Reviews & Ratings", icon: StarIcon },
];

export default function ProfilePage() {
  const [active, setActive] = useState("profile");
  const { items: wishlist } = useWishlist();
  // Placeholder user data
  const [name, setName] = useState("Shaheryar");
  const [email, setEmail] = useState("shaheryar@email.com");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const user = {
    name,
    email,
    avatar: null,
  };

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileMsg("");
    // TODO: Call API to update name/email
    setTimeout(() => {
      setSaving(false);
      setProfileMsg("Profile updated!");
    }, 1000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwSaving(true);
    setPwMsg("");
    if (newPassword !== confirmPassword) {
      setPwMsg("New passwords do not match.");
      setPwSaving(false);
      return;
    }
    // TODO: Call API to change password
    setTimeout(() => {
      setPwSaving(false);
      setPwMsg("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col items-center py-8">
        <div className="flex flex-col items-center mb-8">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-2" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 mb-2">
              {user.name[0]}
            </div>
          )}
          <div className="font-semibold text-lg text-blue-700">{user.name}</div>
          <div className="text-gray-500 text-sm">{user.email}</div>
        </div>
        <nav className="flex flex-col gap-2 w-full px-4">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition
                ${active === key ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 space-y-8">
          {active === "profile" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Profile Overview</h2>
              <form onSubmit={handleProfileSave} className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                {profileMsg && <div className="text-green-600 text-sm mt-2">{profileMsg}</div>}
              </form>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h3 className="font-semibold text-blue-700 mb-2">Change Password</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition" disabled={pwSaving}>{pwSaving ? "Changing..." : "Change Password"}</button>
                {pwMsg && <div className="text-green-600 text-sm mt-2">{pwMsg}</div>}
              </form>
            </section>
          )}
          {active === "orders" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Order History</h2>
              <OrderHistory />
            </section>
          )}
          {active === "addresses" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Address Book</h2>
              <AddressBook />
            </section>
          )}
          {active === "payments" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Payment Methods</h2>
              <PaymentMethods />
            </section>
          )}
          {active === "settings" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Account Settings</h2>
              <AccountSettings />
            </section>
          )}
          {active === "wishlist" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Wishlist / Saved Items</h2>
              <div className="bg-gray-50 rounded p-4">
                {wishlist.length === 0 ? (
                  <div className="text-gray-400 text-center">No saved products yet.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded shadow-sm">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80" alt="No image" className="w-16 h-16 object-cover rounded opacity-50" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-blue-700">{item.name}</div>
                          <div className="text-gray-500 text-sm">{item.description}</div>
                        </div>
                        <div className="font-bold text-green-600 text-lg">${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
          {active === "reviews" && (
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Reviews & Ratings</h2>
              <Reviews />
            </section>
          )}
        </div>
      </main>
    </div>
  );
} 