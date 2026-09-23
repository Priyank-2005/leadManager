import { getClients } from '@/app/actions/clients'
import ClientsTab from '@/components/ClientsTab'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ClientsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const clients = await getClients()

  return (
    <div className="w-full space-y-6">

      <ClientsTab clients={clients} userId={session.id} />
    </div>
  )
}
