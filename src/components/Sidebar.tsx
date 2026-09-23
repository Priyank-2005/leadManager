'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Users, BarChart2 } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Leads', icon: ClipboardList },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/revenue', label: 'Revenue', icon: BarChart2 },
  ]

  return (
    <aside className="w-64 bg-slate-50 min-h-screen flex flex-col border-r border-gray-100 p-4 shrink-0">
      <Link href="/" className="flex items-center gap-2 mb-10 pl-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[13px] tracking-tight">
          A&P
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Workspace</h1>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
