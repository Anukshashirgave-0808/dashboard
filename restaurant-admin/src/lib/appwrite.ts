// src/lib/appwrite.ts
import { Client, Databases, Account } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. "https://cloud.appwrite.io/v1"
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

// Export Appwrite services
export const databases = new Databases(client);
export const account = new Account(client);
