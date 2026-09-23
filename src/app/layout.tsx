import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

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
        {session && (
          <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-6">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2.5 mr-8">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[13px] tracking-tight">
                    A&P
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Workspace</h1>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</Link>
                  <Link href="/leads" className="text-sm font-medium text-gray-500 hover:text-gray-900">Leads</Link>
                  <Link href="/clients" className="text-sm font-medium text-gray-500 hover:text-gray-900">Clients</Link>
                  <Link href="/revenue" className="text-sm font-medium text-gray-500 hover:text-gray-900">Revenue</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">Hi, {session.name}</span>
                <LogoutButton />
              </div>
            </div>
          </nav>
        )}
        <main className={`flex-1 w-full ${session ? 'max-w-7xl mx-auto p-6' : ''}`}>
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
