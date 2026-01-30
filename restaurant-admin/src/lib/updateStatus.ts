import { databases } from "./appwrite";

const DATABASE_ID = "[YOUR_DATABASE_ID]";
const COLLECTION_ID = "[YOUR_COLLECTION_ID]";

export async function updateOrderStatus(orderId: string, status: string) {
  return databases.updateDocument(DATABASE_ID, COLLECTION_ID, orderId, { status });
}
