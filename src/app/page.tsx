import { getLeads } from './actions/leads'
import { getClients } from './actions/clients'
import Dashboard from '@/components/Dashboard'
import { getSession } from '@/lib/auth'

export default async function Home() {
  const session = await getSession()
  const leads = await getLeads()
  const clients = await getClients()

  return (
    <div className="w-full">
      <Dashboard initialLeads={leads} initialClients={clients} userName={session?.name} />
    </div>
  )
}
