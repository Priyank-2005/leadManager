import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/lib/auth";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const font = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "A&P Workspace",
  description: "Next-gen Lead & Client Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased bg-[#F8FAFC] text-gray-900 min-h-screen flex flex-col`}
      >
        {session && <Navbar userName={session.name} />}
        <main className={`flex-1 w-full ${session ? 'max-w-7xl mx-auto p-4 md:p-6 overflow-x-hidden' : ''}`}>
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
