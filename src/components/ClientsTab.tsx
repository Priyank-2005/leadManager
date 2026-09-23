'use client'

import { useState } from 'react'
import { createClient, updateClient } from '@/app/actions/clients'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { format } from 'date-fns'
import { Edit2, Trash2, Search } from 'lucide-react'
export default function ClientsTab({ clients, userId }: { clients: any[], userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<{
    name: string
    businessType: string
    instagramUrl: string
    websiteUrl: string
    agreedPrice: number
    projectDetails: string
    liveDate: string
  }>({
    name: '',
    businessType: '',
    instagramUrl: '',
    websiteUrl: '',
    agreedPrice: 0,
    projectDetails: '',
    liveDate: ''
  })

  const handleOpenDialog = (client?: any) => {
    if (client) {
      setEditingId(client.id)
      setFormData({
        name: client.name,
        businessType: client.businessType || '',
        instagramUrl: client.instagramUrl || '',
        websiteUrl: client.websiteUrl || '',
        agreedPrice: client.agreedPrice || 0,
        projectDetails: client.projectDetails || '',
        liveDate: client.liveDate ? new Date(client.liveDate).toISOString().slice(0,10) : ''
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        businessType: '',
        instagramUrl: '',
        websiteUrl: '',
        agreedPrice: 0,
        projectDetails: '',
        liveDate: ''
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
      instagramUrl: formData.instagramUrl,
      websiteUrl: formData.websiteUrl,
      agreedPrice: Number(formData.agreedPrice),
      projectDetails: formData.projectDetails,
      liveDate: formData.liveDate ? new Date(formData.liveDate) : undefined
    }
    
    if (editingId) {
      await updateClient(editingId as string, payload as any)
    } else {
      await createClient(payload as any)
    }
    setIsOpen(false)
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clients Portfolio</h1>
          <p className="text-gray-500 mt-1">Manage your active clients and project details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search clients..."
              className="pl-9 bg-white border-gray-200 focus-visible:ring-emerald-500 rounded-full w-[250px] shadow-sm"
            />
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-sm">+ Add Client</Button>
        </div>
      </div>
      <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableRow className="border-gray-100/50">
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Business Type</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Client Since</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Live Date</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Agreed Price</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Project Details</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Links</TableHead>
                <TableHead className="text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">No clients found.</TableCell>
              </TableRow>
            )}
            {clients.map((client) => {
              const unreadCount = (client.messages || []).filter((m: any) => m.userId !== userId && !m.isRead).length;
              return (
              <TableRow key={client.id} className="cursor-pointer hover:bg-gray-50/50 border-gray-100/50 transition-colors" onClick={(e) => {
                if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return
                window.location.href = `/clients/${client.id}`
              }}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                      {client.name.substring(0,2)}
                    </div>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      {client.name}
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 font-medium">{client.businessType || '-'}</TableCell>
                <TableCell className="text-gray-600 font-medium">{client.createdAt ? format(new Date(client.createdAt), 'MMM d, yyyy') : '-'}</TableCell>
                <TableCell className="text-gray-600 font-medium">{client.liveDate ? format(new Date(client.liveDate), 'MMM d, yyyy') : '-'}</TableCell>
                <TableCell className="font-semibold text-gray-900">₹{client.agreedPrice.toLocaleString('en-IN')}</TableCell>
                <TableCell className="max-w-[200px] truncate text-gray-600 font-medium">{client.projectDetails || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {client.websiteUrl && <a href={client.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 font-medium text-sm">Web</a>}
                    {client.instagramUrl && <a href={client.instagramUrl} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-600 font-medium text-sm flex items-center gap-1"><span className="w-5 h-5 bg-pink-100 text-pink-500 rounded flex items-center justify-center text-xs">📷</span> Insta</a>}
                    {!client.websiteUrl && !client.instagramUrl && '-'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => handleOpenDialog(client)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={async () => {
                      if (confirm('Are you sure you want to delete this client?')) {
                        const { deleteClient } = await import('@/app/actions/clients')
                        await deleteClient(client.id)
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Client' : 'Add New Client'}</DialogTitle>
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
              <div>
                <Label>Agreed Price</Label>
                <Input type="number" required value={formData.agreedPrice} onChange={(e) => setFormData({...formData, agreedPrice: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Project Details</Label>
                <Input value={formData.projectDetails} onChange={(e) => setFormData({...formData, projectDetails: e.target.value})} />
              </div>
              <div>
                <Label>Instagram URL</Label>
                <Input type="url" value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} />
              </div>
              <div>
                <Label>Website URL</Label>
                <Input type="url" value={formData.websiteUrl} onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})} />
              </div>
              <div>
                <Label>Live Date</Label>
                <Input type="date" value={formData.liveDate} onChange={(e) => setFormData({...formData, liveDate: e.target.value})} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Client'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
