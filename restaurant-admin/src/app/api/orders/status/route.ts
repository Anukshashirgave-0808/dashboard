import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export async function PATCH(req: Request) {
  const { orderId, status } = await req.json();

  await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!,
    orderId,
    { status }
  );

  return NextResponse.json({ success: true });
}
