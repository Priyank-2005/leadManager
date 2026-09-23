'use client'

import { useState } from 'react'
import { assignRevenue } from '@/app/actions/revenue'
import { Card } from '@/components/ui/card'
import { User, Briefcase, IndianRupee } from 'lucide-react'

type ClientData = {
  id: string
  name: string
  agreedPrice: number
  revenueAssigneeId: string | null
}

export default function RevenueDistribution({ initialClients, users }: { initialClients: ClientData[], users: any[] }) {
  const [clients, setClients] = useState(initialClients)
  const [debtSettled, setDebtSettled] = useState(false)

  const handleDragStart = (e: React.DragEvent, id: string, type: 'CLIENT' | 'DEBT') => {
    e.dataTransfer.setData('id', id)
    e.dataTransfer.setData('type', type)
  }

  const handleDrop = async (e: React.DragEvent, assigneeId: string | null) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('id')
    const type = e.dataTransfer.getData('type')
    
    if (type === 'CLIENT') {
      setClients(prev => prev.map(c => c.id === id ? { ...c, revenueAssigneeId: assigneeId } : c))
      setDebtSettled(false)
      await assignRevenue(id, assigneeId)
    } else if (type === 'DEBT') {
      // id is who owes who. e.g. "priyank_owes_ayushi"
      // If it is dropped into the person who is owed, we consider it settled.
      if (id === 'priyank_owes_ayushi' && assigneeId === ayushi?.id) {
        setDebtSettled(true)
      } else if (id === 'ayushi_owes_priyank' && assigneeId === priyank?.id) {
        setDebtSettled(true)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const priyank = users.find(u => u.name.toLowerCase().includes('priyank'))
  const ayushi = users.find(u => u.name.toLowerCase().includes('ayushi'))

  const priyankClients = clients.filter(c => c.revenueAssigneeId === priyank?.id)
  const ayushiClients = clients.filter(c => c.revenueAssigneeId === ayushi?.id)
  const unassignedClients = clients.filter(c => !c.revenueAssigneeId && c.agreedPrice > 0)

  let priyankTotal = priyankClients.reduce((acc, c) => acc + c.agreedPrice, 0)
  let ayushiTotal = ayushiClients.reduce((acc, c) => acc + c.agreedPrice, 0)

  const diff = priyankTotal - ayushiTotal
  let oweAmount = 0
  let oweType: 'priyank_owes_ayushi' | 'ayushi_owes_priyank' | null = null
  
  if (diff > 0) {
    oweAmount = diff / 2
    oweType = 'priyank_owes_ayushi'
  } else if (diff < 0) {
    oweAmount = Math.abs(diff) / 2
    oweType = 'ayushi_owes_priyank'
  }

  if (debtSettled && oweType === 'priyank_owes_ayushi') {
    priyankTotal -= oweAmount
    ayushiTotal += oweAmount
  } else if (debtSettled && oweType === 'ayushi_owes_priyank') {
    ayushiTotal -= oweAmount
    priyankTotal += oweAmount
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Priyank's Bucket */}
        <div 
          className="bg-indigo-50/50 rounded-3xl p-6 border-2 border-dashed border-indigo-200 flex flex-col h-full"
          onDrop={(e) => handleDrop(e, priyank?.id || null)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white"><User className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{priyank?.name || 'Priyank'}</h3>
              <p className="text-sm font-semibold text-indigo-600">₹{priyankTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {priyankClients.map(c => (
              <div key={c.id} draggable onDragStart={(e) => handleDragStart(e, c.id, 'CLIENT')} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 cursor-grab active:cursor-grabbing hover:shadow-md transition">
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500 font-medium">₹{c.agreedPrice.toLocaleString('en-IN')}</p>
              </div>
            ))}
            {!debtSettled && oweType === 'priyank_owes_ayushi' && (
              <div draggable onDragStart={(e) => handleDragStart(e, oweType!, 'DEBT')} className="bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200 cursor-grab active:cursor-grabbing hover:shadow-md transition animate-pulse">
                <p className="font-semibold text-orange-800">Owed to Ayushi</p>
                <p className="text-sm text-orange-600 font-bold">₹{oweAmount.toLocaleString('en-IN')}</p>
              </div>
            )}
            {debtSettled && oweType === 'ayushi_owes_priyank' && (
              <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
                <p className="font-semibold text-green-800">Received from Ayushi</p>
                <p className="text-sm text-green-600 font-bold">₹{oweAmount.toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Unassigned Bucket */}
        <div 
          className="bg-gray-50/50 rounded-3xl p-6 border-2 border-dashed border-gray-200 flex flex-col h-full"
          onDrop={(e) => handleDrop(e, null)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-lg text-gray-600">Unassigned</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {unassignedClients.map(c => (
              <div key={c.id} draggable onDragStart={(e) => handleDragStart(e, c.id, 'CLIENT')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition">
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500 font-medium">₹{c.agreedPrice.toLocaleString('en-IN')}</p>
              </div>
            ))}
            {unassignedClients.length === 0 && <p className="text-center text-sm text-gray-400 mt-10">All clients assigned!</p>}
          </div>
        </div>

        {/* Ayushi's Bucket */}
        <div 
          className="bg-emerald-50/50 rounded-3xl p-6 border-2 border-dashed border-emerald-200 flex flex-col h-full"
          onDrop={(e) => handleDrop(e, ayushi?.id || null)}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white"><User className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{ayushi?.name || 'Ayushi'}</h3>
              <p className="text-sm font-semibold text-emerald-600">₹{ayushiTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {ayushiClients.map(c => (
              <div key={c.id} draggable onDragStart={(e) => handleDragStart(e, c.id, 'CLIENT')} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 cursor-grab active:cursor-grabbing hover:shadow-md transition">
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500 font-medium">₹{c.agreedPrice.toLocaleString('en-IN')}</p>
              </div>
            ))}
            {!debtSettled && oweType === 'ayushi_owes_priyank' && (
              <div draggable onDragStart={(e) => handleDragStart(e, oweType!, 'DEBT')} className="bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200 cursor-grab active:cursor-grabbing hover:shadow-md transition animate-pulse">
                <p className="font-semibold text-orange-800">Owed to Priyank</p>
                <p className="text-sm text-orange-600 font-bold">₹{oweAmount.toLocaleString('en-IN')}</p>
              </div>
            )}
            {debtSettled && oweType === 'priyank_owes_ayushi' && (
              <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
                <p className="font-semibold text-green-800">Received from Priyank</p>
                <p className="text-sm text-green-600 font-bold">₹{oweAmount.toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
