import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import ChatBox from '@/components/ChatBox'
import ClientDetails from '@/components/ClientDetails'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function ClientPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession()
  if (!session) redirect('/login')

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' }
      },
      milestones: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!client) return notFound()

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] overflow-hidden">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link href="/">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <p className="text-gray-500">{client.businessType || 'Client'}</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full min-h-0 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ClientDetails client={client} />
        </div>
        <div className="h-full min-h-0">
          <ChatBox initialMessages={client.messages} userId={session.id} clientId={client.id} />
        </div>
      </div>
    </div>
  )
}
