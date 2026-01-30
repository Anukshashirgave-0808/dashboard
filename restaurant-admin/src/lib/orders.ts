// src/lib/orders.ts
import { databases } from "@/lib/appwrite";
import { Models } from "appwrite";

/* =========================
   Order Type
========================= */
export interface Order extends Models.Document {
  email: string;
  isGuest: boolean;
  name: string;
  country: string;
  state?: string;
  city?: string;
  street?: string;
  pincode?: string;
  phone?: string;
  paymentMethod: string;
  items: string; // You can parse this as JSON if stored as stringified array
  total: number;
  status: "pending" | "preparing" | "delivered";
}

/* =========================
   Get Orders
========================= */
export async function getOrders(): Promise<Order[]> {
  if (!process.env.NEXT_PUBLIC_DATABASE_ID || !process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID) {
    throw new Error("Database ID or Collection ID not defined in environment variables!");
  }

  const res = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!
  );

  // Map Appwrite documents to Order type
  return res.documents.map((doc: any) => ({
    $id: doc.$id,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
    email: doc.email || "",
    isGuest: doc.isGuest || false,
    name: doc.name || "",
    country: doc.country || "",
    state: doc.state || "",
    city: doc.city || "",
    street: doc.street || "",
    pincode: doc.pincode || "",
    phone: doc.phone || "",
    paymentMethod: doc.paymentMethod || "COD",
    items: doc.items || "[]",
    total: doc.total || 0,
    status: doc.status || "pending",
  })) as Order[];
}

/* =========================
   Update Order Status
========================= */
export async function updateOrderStatus(orderId: string, status: "pending" | "preparing" | "delivered") {
  return databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!,
    orderId,
    { status }
  );
}
