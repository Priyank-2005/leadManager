import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RevenueDistribution from '@/components/RevenueDistribution'

export default async function RevenuePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const clients = await prisma.client.findMany({
    where: { agreedPrice: { gt: 0 } },
    select: { id: true, name: true, agreedPrice: true, revenueAssigneeId: true }
  })

  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  })

  return (
    <div className="w-full space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue Distribution</h2>
      <RevenueDistribution initialClients={clients} users={users} />
    </div>
  )
}
