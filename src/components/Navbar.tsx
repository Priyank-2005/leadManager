'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function Navbar({ userName }: { userName: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 mr-8" onClick={() => setIsOpen(false)}>
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
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">Hi, {userName}</span>
          <LogoutButton />
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-900 focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="flex flex-col space-y-2 p-4 px-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link href="/leads" className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>Leads</Link>
            <Link href="/clients" className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>Clients</Link>
            <Link href="/revenue" className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>Revenue</Link>
            <div className="border-t border-gray-100 my-2 pt-4 flex flex-col gap-4">
              <span className="text-sm font-medium text-gray-700">Hi, {userName}</span>
              <div className="w-fit">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
