import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import ChatBox from '@/components/ChatBox'
import LeadDetails from '@/components/LeadDetails'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function LeadPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession()
  if (!session) redirect('/login')

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      meets: { orderBy: { date: 'asc' } },
      messages: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!lead) return notFound()

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] overflow-hidden">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/">
          <Button variant="outline" size="icon" className="rounded-full"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{lead.name}</h2>
          <p className="text-gray-500">{lead.businessType || 'No business type'} • {lead.status}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="h-full min-h-0 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <LeadDetails lead={lead} />
        </div>
        <div className="h-full min-h-0">
          <ChatBox initialMessages={lead.messages} userId={session.id} leadId={lead.id} />
        </div>
      </div>
    </div>
  )
}
