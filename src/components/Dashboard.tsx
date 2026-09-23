'use client'

import { Users, Briefcase, TrendingUp, Calendar, Clock } from 'lucide-react'
import { format, isToday, isFuture } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { updateLead } from '@/app/actions/leads'
import { toggleMeetStatus, updateMeetDate } from '@/app/actions/meets'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type DashboardProps = {
  initialLeads: any[]
  initialClients: any[]
  userName?: string
}

export default function Dashboard({ initialLeads, initialClients, userName }: DashboardProps) {
  const [editingMeetId, setEditingMeetId] = useState<string | null>(null)
  const [newMeetDate, setNewMeetDate] = useState('')

  const wonLeads = initialLeads.filter(l => l.status === 'WON').length
  const totalLeads = initialLeads.length
  
  const totalRevenue = initialClients.reduce((acc, c) => acc + (c.amountReceived || 0), 0)

  const calculateGrowth = (items: any[], dateField: string, sumField?: string) => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    let currentPeriod = 0
    let previousPeriod = 0

    items.forEach(item => {
      if (!item[dateField]) return
      const d = new Date(item[dateField])
      const val = sumField ? (item[sumField] || 0) : 1
      if (d >= sevenDaysAgo) currentPeriod += val
      else if (d >= fourteenDaysAgo && d < sevenDaysAgo) previousPeriod += val
    })

    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100)
  }

  const leadsGrowth = calculateGrowth(initialLeads, 'createdAt')
  const clientsGrowth = calculateGrowth(initialClients, 'createdAt')
  const revenueGrowth = calculateGrowth(initialClients, 'createdAt', 'amountReceived')

  // Upcoming Follow-Ups
  const upcomingFollowUps = initialLeads.filter(l => l.nextFollowUp && (isToday(new Date(l.nextFollowUp)) || isFuture(new Date(l.nextFollowUp))))
    .sort((a, b) => new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime())
    .slice(0, 5)

  // Upcoming Meets
  const allMeets = initialLeads.flatMap(l => l.meets?.map((m: any) => ({ ...m, leadName: l.name })) || [])
  const upcomingMeets = allMeets.filter(m => m.status === 'SCHEDULED' && (isToday(new Date(m.date)) || isFuture(new Date(m.date))))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const handleFollowUpDone = async (leadId: string, checked: boolean) => {
    if (checked) {
      await updateLead(leadId, { nextFollowUp: null })
    }
  }

  const handleMeetDone = async (meetId: string, checked: boolean) => {
    await toggleMeetStatus(meetId, checked ? 'COMPLETED' : 'SCHEDULED')
  }

  const handleReschedule = async (meetId: string) => {
    if (!newMeetDate) return
    await updateMeetDate(meetId, new Date(newMeetDate))
    setEditingMeetId(null)
    setNewMeetDate('')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">Welcome back, {userName || 'User'} 👋</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your business activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Total Leads</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalLeads}</h3>
            <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${leadsGrowth > 0 ? 'text-emerald-500' : leadsGrowth < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {leadsGrowth > 0 ? '↑' : leadsGrowth < 0 ? '↓' : '-'} {Math.abs(leadsGrowth)}% <span className="text-gray-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Active Clients</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{initialClients.length}</h3>
            <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${clientsGrowth > 0 ? 'text-emerald-500' : clientsGrowth < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {clientsGrowth > 0 ? '↑' : clientsGrowth < 0 ? '↓' : '-'} {Math.abs(clientsGrowth)}% <span className="text-gray-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Revenue Received</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${revenueGrowth > 0 ? 'text-emerald-500' : revenueGrowth < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {revenueGrowth > 0 ? '↑' : revenueGrowth < 0 ? '↓' : '-'} {Math.abs(revenueGrowth)}% <span className="text-gray-400 font-normal">vs last week</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-500" /> Upcoming Follow-ups</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View all →</button>
          </div>
          {upcomingFollowUps.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">No upcoming follow-ups.</p> : (
            <div className="space-y-3">
              {upcomingFollowUps.map(lead => (
                <div key={lead.id} className="flex items-start sm:items-center gap-4 text-sm p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="mt-1 sm:mt-0"><Checkbox id={`lead-${lead.id}`} onCheckedChange={(checked) => handleFollowUpDone(lead.id, !!checked)} /></div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 cursor-pointer">
                    <div>
                      <label htmlFor={`lead-${lead.id}`} className="font-semibold text-gray-900 cursor-pointer block">{lead.name}</label>
                      <span className="text-xs text-gray-500">Follow up call</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-1 text-blue-600 font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(lead.nextFollowUp), 'MMM d, yyyy')}</span>
                        <span className="text-gray-400 text-xs ml-1">{format(new Date(lead.nextFollowUp), 'h:mm a')}</span>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Pending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-500" /> Scheduled Meets</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View all →</button>
          </div>
          {upcomingMeets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-600">No scheduled meets.</p>
              <p className="text-xs text-gray-400 mb-4">Schedule meetings with your leads and clients.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">+ Schedule a Meet</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeets.map(meet => (
                <div key={meet.id} className="flex flex-col text-sm p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="mt-1 sm:mt-0"><Checkbox id={`meet-${meet.id}`} onCheckedChange={(checked) => handleMeetDone(meet.id, !!checked)} /></div>
                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <div>
                        <label htmlFor={`meet-${meet.id}`} className="font-semibold text-gray-900 cursor-pointer block">{meet.title}</label>
                        <p className="text-xs text-gray-500 mt-0.5">with {meet.leadName}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg text-xs whitespace-nowrap">{format(new Date(meet.date), 'MMM d, p')}</span>
                        {editingMeetId !== meet.id && (
                          <button onClick={() => setEditingMeetId(meet.id)} className="text-xs text-gray-400 hover:text-indigo-600 flex items-center gap-1 sm:mt-1"><Clock className="w-3 h-3" /> Reschedule</button>
                        )}
                      </div>
                    </div>
                  </div>
                  {editingMeetId === meet.id && (
                    <div className="mt-3 flex gap-2 items-center pl-8 border-t border-gray-100 pt-3">
                      <Input type="datetime-local" size={1} className="h-8 text-xs flex-1 rounded-lg bg-white" value={newMeetDate} onChange={(e) => setNewMeetDate(e.target.value)} />
                      <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg" onClick={() => handleReschedule(meet.id)}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditingMeetId(null)}>Cancel</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
