import { getLeads } from '@/app/actions/leads'
import LeadsTab from '@/components/LeadsTab'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LeadsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const leads = await getLeads()

  return (
    <div className="w-full space-y-6">

      <LeadsTab leads={leads} userId={session.id} />
    </div>
  )
}
