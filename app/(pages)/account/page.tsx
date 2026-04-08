"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const LAST_VISITED_KEY = "hety_last_visited";

type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type Preferences = {
  email: boolean;
  offers: boolean;
  orders: boolean;
};

type AccountOrder = {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  invoiceNumber: string;
  trackingNumber: string;
  items: Array<{
    id: string;
    quantity: number;
    name: string;
    price: number;
    sku: string;
    product: Product | null;
  }>;
};

type ProfilePayload = {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpend: number;
    preferences: Preferences;
    addresses: Address[];
  };
  wishlistProducts: Product[];
  orders: AccountOrder[];
};

const emptyAddress: Address = {
  id: "",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false
};

export default function AccountPage() {
  const router = useRouter();
  const { wishlist, addToCart, toggleWishlist, logout, isLoggedIn, customer, openAuth } =
    useCart();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: ""
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [preferences, setPreferences] = useState<Preferences>({
    email: true,
    offers: true,
    orders: true
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressDraft, setAddressDraft] = useState<Address>(emptyAddress);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/account/profile", { cache: "no-store" });
        if (response.status === 401) {
          if (isMounted) {
            setProfile(null);
          }
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          if (isMounted) {
            setError(data.error || "Could not load account.");
            setProfile(null);
          }
          return;
        }

        if (!isMounted) {
          return;
        }

        setProfile(data);
        setForm({
          name: data.customer.name || "",
          email: data.customer.email || "",
          phone: data.customer.phone || ""
        });
        setPreferences(data.customer.preferences || {
          email: true,
          offers: true,
          orders: true
        });
        setAddresses(data.customer.addresses || []);
      } catch {
        if (isMounted) {
          setProfile(null);
          setError("Could not load account. Please sign in again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const wishlistItems = useMemo(() => {
    const productMap = new Map<string, Product>();

    (profile?.wishlistProducts || []).forEach((product) => {
      productMap.set(product.id, product);
    });

    return wishlist.map((id) => productMap.get(id)).filter(Boolean) as Product[];
  }, [profile?.wishlistProducts, wishlist]);

  const pendingOrders = useMemo(
    () =>
      (profile?.orders || []).filter(
        (order) => !["Delivered", "Cancelled"].includes(order.status)
      ).length,
    [profile?.orders]
  );

  const handleContinueShopping = () => {
    const last = window.localStorage.getItem(LAST_VISITED_KEY);
    router.push(last || "/");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const persistProfile = async (nextAddresses = addresses, nextPreferences = preferences) => {
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        preferences: nextPreferences,
        addresses: nextAddresses
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Could not save account details.");
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setToast("");
    setError("");

    try {
      await persistProfile();
      setProfile((current) =>
        current
          ? {
              ...current,
              customer: {
                ...current.customer,
                name: form.name,
                phone: form.phone,
                preferences,
                addresses
              }
            }
          : current
      );
      setIsEditingProfile(false);
      setToast("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setError("Please fill all password fields.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }

    const response = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwords.current,
        nextPassword: passwords.next
      })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error || "Could not update password.");
      return;
    }

    setPasswords({ current: "", next: "", confirm: "" });
    setShowPasswordModal(false);
    setToast("Password updated successfully.");
  };

  const handleAddressSave = async () => {
    if (!addressDraft.name || !addressDraft.phone || !addressDraft.line1 || !addressDraft.city) {
      setError("Please complete the address form.");
      return;
    }

    const targetId = addressDraft.id || `addr-${Date.now()}`;
    let nextAddresses = addressDraft.id
      ? addresses.map((address) =>
          address.id === addressDraft.id ? { ...addressDraft, id: targetId } : address
        )
      : [...addresses, { ...addressDraft, id: targetId }];

    if (addressDraft.isDefault) {
      nextAddresses = nextAddresses.map((address) => ({
        ...address,
        isDefault: address.id === targetId
      }));
    }

    setAddresses(nextAddresses);

    try {
      await persistProfile(nextAddresses, preferences);
      setProfile((current) =>
        current
          ? {
              ...current,
              customer: {
                ...current.customer,
                addresses: nextAddresses
              }
            }
          : current
      );
      setShowAddressModal(false);
      setAddressDraft(emptyAddress);
      setToast("Address saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    const nextAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id
    }));
    setAddresses(nextAddresses);

    try {
      await persistProfile(nextAddresses, preferences);
      setProfile((current) =>
        current
          ? {
              ...current,
              customer: {
                ...current.customer,
                addresses: nextAddresses
              }
            }
          : current
      );
      setToast("Default address updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const nextAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(nextAddresses);

    try {
      await persistProfile(nextAddresses, preferences);
      setProfile((current) =>
        current
          ? {
              ...current,
              customer: {
                ...current.customer,
                addresses: nextAddresses
              }
            }
          : current
      );
      setToast("Address removed.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not delete address.");
    }
  };

  const handleReorder = (order: AccountOrder) => {
    const reorderProducts = order.items
      .filter((item) => item.product)
      .map((item) => ({
        product: item.product as Product,
        quantity: item.quantity
      }));

    if (!reorderProducts.length) {
      setError("Products from this order are no longer available.");
      return;
    }

    reorderProducts.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    setToast("Order items added to cart.");
  };

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    toggleWishlist(product.id);
    setToast("Moved to cart.");
  };

  if (isLoading) {
    return (
      <section className="section-padding mx-auto py-12">
        <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
          <p className="text-sm text-slate-600">Loading your account...</p>
        </div>
      </section>
    );
  }

  if (!profile || !isLoggedIn) {
    return (
      <section className="section-padding mx-auto py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-soft">
          <p className="text-xs uppercase tracking-wide text-accent-pink">
            Account Access
          </p>
          <h1 className="mt-2 text-3xl font-display text-slate-900">
            Sign in to view your account
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Access orders, saved addresses, and profile details with your customer account.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={openAuth}
              className="btn-secondary px-6 py-3 text-sm font-semibold"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => router.push("/create-account")}
              className="btn-primary px-6 py-3 text-sm font-semibold"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-secondary px-6 py-3 text-sm font-semibold"
            >
              Go Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding mx-auto py-12">
      {(toast || error) && (
        <div
          className={`mb-6 rounded-2xl border p-4 text-sm ${
            error
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-brand-100 bg-white text-brand-700"
          }`}
        >
          {error || toast}
        </div>
      )}

      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">
          My Account
        </p>
        <h1 className="mt-2 text-3xl font-display text-slate-900">
          Hi, {profile.customer.name || customer?.name || "Customer"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your profile, orders, addresses, and saved items from one place.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Orders", value: String(profile.customer.totalOrders || profile.orders.length) },
            { label: "Pending Orders", value: String(pendingOrders) },
            { label: "Wishlist Items", value: String(wishlistItems.length) }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-brand-100 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-wide text-accent-pink">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-brand-700">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleContinueShopping}
            className="btn-primary px-6 py-3 text-sm font-semibold"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="btn-secondary px-6 py-3 text-sm font-semibold"
          >
            Logout
          </button>
          <p className="self-center text-sm text-slate-500">
            Lifetime spend: ₹{Number(profile.customer.totalSpend || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-700">Profile Details</h2>
            <button
              type="button"
              onClick={() => {
                setError("");
                setToast("");
                setIsEditingProfile((prev) => !prev);
              }}
              className="btn-secondary px-4 py-2 text-xs"
            >
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              disabled={!isEditingProfile}
              className="input-base rounded-2xl px-4 py-3 text-sm disabled:opacity-60"
            />
            <input
              type="email"
              value={form.email}
              disabled
              className="input-base rounded-2xl px-4 py-3 text-sm opacity-60"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              disabled={!isEditingProfile}
              className="input-base rounded-2xl px-4 py-3 text-sm disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => {
                setError("");
                setToast("");
                setShowPasswordModal(true);
              }}
              className="btn-secondary px-4 py-3 text-sm font-semibold"
            >
              Change Password
            </button>
          </div>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={!isEditingProfile || isSavingProfile}
            className="btn-primary mt-5 px-6 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-brand-700">
            Notifications & Preferences
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {[
              { key: "email", label: "Email notifications" },
              { key: "offers", label: "Offers & promotions" },
              { key: "orders", label: "Order updates" }
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between">
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={preferences[item.key as keyof Preferences]}
                  onChange={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof Preferences]
                    }))
                  }
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="btn-secondary w-full px-6 py-3 text-sm font-semibold"
            >
              Save Preferences
            </button>
            <Link href="/contact" className="link-underline block text-sm text-brand-600">
              Contact support
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="btn-secondary w-full px-6 py-3 text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-700">Address Book</h2>
          <button
            type="button"
            onClick={() => {
              setError("");
              setToast("");
              setAddressDraft(emptyAddress);
              setShowAddressModal(true);
            }}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Add New Address
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {addresses.length === 0 && (
            <p className="text-sm text-slate-500">No addresses saved yet.</p>
          )}
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-2xl border border-brand-100 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-700">
                  {address.name}
                </p>
                {address.isDefault && (
                  <span className="rounded-full bg-accent-yellow px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {[address.line1, address.line2, address.city, address.state, address.postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-xs text-slate-500">{address.phone}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddressDraft(address);
                    setShowAddressModal(true);
                  }}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteAddress(address.id)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => void handleSetDefault(address.id)}
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-brand-700">Orders</h2>
        <div className="mt-4 space-y-4">
          {profile.orders.length === 0 && (
            <p className="text-sm text-slate-500">No orders placed yet.</p>
          )}
          {profile.orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-brand-100 bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">{order.orderId}</p>
                  <p className="text-slate-600">
                    {new Date(order.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand-700">
                  ₹{order.amount.toFixed(2)}
                </p>
                <span className="rounded-full bg-accent-yellow px-3 py-1 text-xs font-semibold text-slate-900">
                  {order.status}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOrderId((current) => (current === order.id ? null : order.id))
                    }
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                  </button>
                  {order.trackingNumber ? (
                    <Link
                      href={`https://www.google.com/search?q=${encodeURIComponent(order.trackingNumber)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary px-4 py-2 text-xs"
                    >
                      Tracking
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-secondary px-4 py-2 text-xs opacity-60"
                    >
                      Tracking Unavailable
                    </button>
                  )}
                  <a
                    href={`/api/account/orders/${order.id}/invoice`}
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Download Invoice
                  </a>
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    Reorder
                  </button>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-accent-pink">
                        Payment
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{order.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-accent-pink">
                        Shipping
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{order.shippingStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-accent-pink">
                        Invoice
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {order.invoiceNumber || order.orderId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl border border-brand-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Qty: {item.quantity}
                            {item.sku ? ` | SKU: ${item.sku}` : ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="self-center text-sm font-semibold text-brand-700">
                            ₹{Number(item.price || 0).toFixed(2)}
                          </span>
                          {item.product?.slug ? (
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="btn-secondary px-4 py-2 text-xs"
                            >
                              View Product
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-brand-700">Wishlist</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.length === 0 && (
            <p className="text-sm text-slate-500">No saved items yet.</p>
          )}
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-brand-100 bg-white p-4"
            >
              <p className="text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="mt-1 text-sm text-brand-600">₹{item.price}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className="btn-primary px-4 py-2 text-xs"
                >
                  Move to Cart
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(item.id)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-brand-100 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-brand-700">
              {addressDraft.id ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                value={addressDraft.name}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Name"
                className="input-base rounded-2xl px-4 py-3 text-sm"
              />
              <input
                value={addressDraft.phone}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="Phone"
                className="input-base rounded-2xl px-4 py-3 text-sm"
              />
              <input
                value={addressDraft.line1}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, line1: event.target.value }))
                }
                placeholder="Address line 1"
                className="input-base rounded-2xl px-4 py-3 text-sm sm:col-span-2"
              />
              <input
                value={addressDraft.line2}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, line2: event.target.value }))
                }
                placeholder="Address line 2"
                className="input-base rounded-2xl px-4 py-3 text-sm sm:col-span-2"
              />
              <input
                value={addressDraft.city}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, city: event.target.value }))
                }
                placeholder="City"
                className="input-base rounded-2xl px-4 py-3 text-sm"
              />
              <input
                value={addressDraft.state}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, state: event.target.value }))
                }
                placeholder="State"
                className="input-base rounded-2xl px-4 py-3 text-sm"
              />
              <input
                value={addressDraft.postalCode}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, postalCode: event.target.value }))
                }
                placeholder="Pincode"
                className="input-base rounded-2xl px-4 py-3 text-sm"
              />
              <input
                value={addressDraft.country}
                onChange={(event) =>
                  setAddressDraft((prev) => ({ ...prev, country: event.target.value }))
                }
                placeholder="Country"
                className="input-base rounded-2xl px-4 py-3 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={addressDraft.isDefault}
                  onChange={() =>
                    setAddressDraft((prev) => ({
                      ...prev,
                      isDefault: !prev.isDefault
                    }))
                  }
                />
                Set as default
              </label>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="btn-secondary px-5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleAddressSave()}
                className="btn-primary px-5 py-2 text-sm"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-brand-100 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-brand-700">Change Password</h3>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={passwords.current}
                onChange={(event) =>
                  setPasswords((prev) => ({ ...prev, current: event.target.value }))
                }
                className="input-base w-full rounded-2xl px-4 py-3 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                value={passwords.next}
                onChange={(event) =>
                  setPasswords((prev) => ({ ...prev, next: event.target.value }))
                }
                className="input-base w-full rounded-2xl px-4 py-3 text-sm"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(event) =>
                  setPasswords((prev) => ({ ...prev, confirm: event.target.value }))
                }
                className="input-base w-full rounded-2xl px-4 py-3 text-sm"
              />
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="btn-secondary px-5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handlePasswordSave()}
                className="btn-primary px-5 py-2 text-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
