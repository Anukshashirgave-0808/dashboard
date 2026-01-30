// src/app/page.tsx
"use client"; // This makes it a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to admin login
    router.push("/admin/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Redirecting to Admin Login...
      </h1>
    </div>
  );
}
