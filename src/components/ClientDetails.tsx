'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { addMilestone, toggleMilestone, deleteMilestone } from '@/app/actions/milestones'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

export default function ClientDetails({ client }: { client: any }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return
    setLoading(true)
    await addMilestone({
      clientId: client.id,
      title,
      amount: Number(amount),
      dueDate: dueDate ? new Date(dueDate) : undefined
    })
    setTitle('')
    setAmount('')
    setDueDate('')
    setLoading(false)
  }

  const balance = client.agreedPrice - client.amountReceived

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl">
              <p className="text-sm text-indigo-600 font-medium">Agreed Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{client.agreedPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm text-green-600 font-medium">Received</p>
              <p className="text-2xl font-bold text-gray-900">₹{client.amountReceived.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-sm text-orange-600 font-medium">Balance</p>
              <p className="text-2xl font-bold text-gray-900">₹{balance.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {client.projectDetails && (
            <div className="mt-4">
              <Label>Project Scope & Details</Label>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{client.projectDetails}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Timeline & Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {client.milestones?.map((m: any) => (
              <div key={m.id} className={`flex items-center justify-between p-3 border rounded-lg ${m.isPaid ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={m.isPaid} 
                    onCheckedChange={(checked) => toggleMilestone(m.id, client.id, !!checked)} 
                  />
                  <div>
                    <p className={`font-medium ${m.isPaid ? 'line-through text-gray-500' : 'text-gray-900'}`}>{m.title}</p>
                    {m.dueDate && <p className="text-xs text-gray-500">Due: {format(new Date(m.dueDate), 'PP')}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">₹{m.amount.toLocaleString('en-IN')}</span>
                  <button onClick={() => deleteMilestone(m.id, client.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {client.milestones?.length === 0 && (
              <p className="text-sm text-gray-500 italic">No milestones added yet.</p>
            )}

            <form onSubmit={handleAdd} className="mt-4 pt-4 border-t space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Add Milestone</h4>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="e.g. Advance" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} size="sm" className="w-full">Add Milestone</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
