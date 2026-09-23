'use client'

import { useState, useMemo } from 'react'
import { createLead, updateLead } from '@/app/actions/leads'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import confetti from 'canvas-confetti'
import { ArrowUpDown, Search, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const STATUSES = ['NEW', 'CONTACTED', 'NEGOTIATION', 'WON', 'LOST']

export default function LeadsTab({ leads, userId }: { leads: any[], userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  const [formData, setFormData] = useState<{
    name: string
    businessType: string
    status: string
    lastUpdate: string
    instagramUrl: string
    nextFollowUp: string
    conversionProbability: number
  }>({
    name: '',
    businessType: '',
    status: 'NEW',
    lastUpdate: '',
    instagramUrl: '',
    nextFollowUp: '',
    conversionProbability: 0
  })

  const handleOpenDialog = (lead?: any) => {
    if (lead) {
      setEditingId(lead.id)
      setFormData({
        name: lead.name,
        businessType: lead.businessType || '',
        status: lead.status,
        lastUpdate: lead.lastUpdate || '',
        instagramUrl: lead.instagramUrl || '',
        nextFollowUp: lead.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().slice(0,16) : '',
        conversionProbability: lead.conversionProbability || 0
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        businessType: '',
        status: 'NEW',
        lastUpdate: '',
        instagramUrl: '',
        nextFollowUp: '',
        conversionProbability: 0
      })
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      name: formData.name,
      businessType: formData.businessType,
      status: formData.status,
      lastUpdate: formData.lastUpdate,
      instagramUrl: formData.instagramUrl,
      nextFollowUp: formData.nextFollowUp ? new Date(formData.nextFollowUp) : undefined,
      conversionProbability: Number(formData.conversionProbability)
    }
    
    let result = null
    if (editingId) {
      result = await updateLead(editingId as string, payload as any)
    } else {
      await createLead(payload as any)
    }

    if (formData.status === 'WON' && (!editingId || result === null)) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      })
      toast.success('Congratulations! Lead converted to Client 🎉')
    }

    setIsOpen(false)
    setLoading(false)
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads]

    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter)
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(lowerQuery) || 
        (lead.businessType && lead.businessType.toLowerCase().includes(lowerQuery))
      )
    }

    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [leads, searchQuery, statusFilter, sortConfig])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-gray-500 mt-1">Manage your potential clients and track progress from first contact to closure.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search leads..."
              className="pl-9 bg-white border-gray-200 focus-visible:ring-blue-500 rounded-full w-[250px] shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm">+ Add Lead</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-gray-50 overflow-x-auto">
          <button onClick={() => setStatusFilter(null)} className={`px-4 py-2 text-sm font-medium rounded-full ${!statusFilter ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>All ({leads.length})</button>
          {STATUSES.map(status => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 text-sm font-medium rounded-full ${statusFilter === status ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
              {status.charAt(0) + status.slice(1).toLowerCase()} ({leads.filter(l => l.status === status).length})
            </button>
          ))}
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableRow className="border-gray-100/50">
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Business Type</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Date Added</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Next Follow Up</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">
                  <Button variant="ghost" className="p-0 hover:bg-transparent font-semibold text-gray-500 text-xs uppercase tracking-wider" onClick={() => handleSort('conversionProbability')}>
                    Probability <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Instagram</TableHead>
                <TableHead className="text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">No leads found.</TableCell>
                </TableRow>
              )}
              {filteredAndSortedLeads.map((lead) => {
                const unreadCount = (lead.messages || []).filter((m: any) => m.userId !== userId && !m.isRead).length;
                return (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50/50 border-gray-100/50 transition-colors" onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return
                  window.location.href = `/leads/${lead.id}`
                }}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                        {lead.name.substring(0,2)}
                      </div>
                      <span className="font-semibold text-gray-900 flex items-center gap-2">
                        {lead.name}
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                            {unreadCount}
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">{lead.businessType || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-semibold border-0 ${lead.status === 'WON' ? 'bg-emerald-50 text-emerald-700' : lead.status === 'LOST' ? 'bg-red-50 text-red-700' : lead.status === 'NEGOTIATION' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {lead.status.charAt(0) + lead.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">{lead.createdAt ? format(new Date(lead.createdAt), 'MMM d, yyyy') : '-'}</TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {lead.nextFollowUp ? (
                      <div className="flex flex-col">
                        <span>{format(new Date(lead.nextFollowUp), 'MMM d, yyyy')}</span>
                        <span className="text-xs text-gray-400">{format(new Date(lead.nextFollowUp), 'h:mm a')}</span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-gray-700">{lead.conversionProbability}%</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${lead.conversionProbability > 50 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${lead.conversionProbability || 0}%` }}></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.instagramUrl ? (
                      <a href={lead.instagramUrl} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600 font-medium text-sm flex items-center gap-1"><span className="w-5 h-5 bg-pink-100 text-pink-500 rounded flex items-center justify-center text-xs">📷</span> Insta</a>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleOpenDialog(lead)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={async () => {
                        if (confirm('Are you sure you want to delete this lead?')) {
                          const { deleteLead } = await import('@/app/actions/leads')
                          await deleteLead(lead.id)
                        }
                      }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Input placeholder="e.g. Agency, E-Commerce" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status as string} onValueChange={(v) => v && setFormData({...formData, status: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formData.status === 'WON' && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    🎉 This lead will be automatically moved to your Clients list!
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Update Notes</Label>
                <Input value={formData.lastUpdate} onChange={(e) => setFormData({...formData, lastUpdate: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Next Follow Up</Label>
                  <Input type="datetime-local" value={formData.nextFollowUp} onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Conversion Probability (%)</Label>
                  <Input type="number" min="0" max="100" value={formData.conversionProbability} onChange={(e) => setFormData({...formData, conversionProbability: Number(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input type="url" value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Lead'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
