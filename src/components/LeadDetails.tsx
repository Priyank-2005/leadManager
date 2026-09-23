'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addMeet, deleteMeet, toggleMeetStatus, updateMeetDate } from '@/app/actions/meets'
import { format } from 'date-fns'
import { Trash2, Calendar, CheckCircle2, Clock } from 'lucide-react'

export default function LeadDetails({ lead }: { lead: any }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingMeetId, setEditingMeetId] = useState<string | null>(null)
  const [newMeetDate, setNewMeetDate] = useState('')

  const handleAddMeet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date) return
    setLoading(true)
    await addMeet({
      leadId: lead.id,
      title,
      date: new Date(date)
    })
    setTitle('')
    setDate('')
    setLoading(false)
  }

  const handleReschedule = async (meetId: string) => {
    if (!newMeetDate) return
    await updateMeetDate(meetId, new Date(newMeetDate))
    setEditingMeetId(null)
    setNewMeetDate('')
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle className="text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Scheduled Meets</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {lead.meets?.map((m: any) => (
              <div key={m.id} className={`flex flex-col p-4 border rounded-2xl ${m.status === 'COMPLETED' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-indigo-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${m.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'}`}>{m.title}</p>
                    <p className="text-sm text-gray-500">{format(new Date(m.date), 'PP p')}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    {m.status !== 'COMPLETED' && editingMeetId !== m.id && (
                      <Button variant="ghost" size="icon" onClick={() => setEditingMeetId(m.id)} className="hover:text-indigo-600">
                        <Clock className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => toggleMeetStatus(m.id, m.status === 'COMPLETED' ? 'SCHEDULED' : 'COMPLETED')} className={m.status === 'COMPLETED' ? 'text-green-600' : 'hover:text-green-600'}>
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMeet(m.id)} className="hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {editingMeetId === m.id && (
                  <div className="mt-3 flex gap-2 items-center border-t border-gray-100 pt-3">
                    <Input type="datetime-local" className="flex-1" value={newMeetDate} onChange={(e) => setNewMeetDate(e.target.value)} />
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => handleReschedule(m.id)}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingMeetId(null)}>Cancel</Button>
                  </div>
                )}
              </div>
            ))}
            
            {(!lead.meets || lead.meets.length === 0) && (
              <div className="text-center py-6 text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No meets scheduled yet.</p>
              </div>
            )}

            <form onSubmit={handleAddMeet} className="mt-4 pt-4 border-t space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Schedule New Meet</h4>
              <div className="space-y-3">
                <Input placeholder="Meet Agenda / Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
                <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="rounded-xl" />
              </div>
              <Button type="submit" disabled={loading} size="sm" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700">Schedule Meet</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
