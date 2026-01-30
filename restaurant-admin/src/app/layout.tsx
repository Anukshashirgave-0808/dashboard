import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";

// Load Google fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the site
export const metadata: Metadata = {
  title: "Restaurant Admin Panel",
  description: "Admin panel for managing restaurant orders",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-black
          text-[#F5B041]
        `}
      >
        {children}
      </body>
    </html>
  );
}
