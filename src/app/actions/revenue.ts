'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function assignRevenue(clientId: string, userId: string | null) {
  await prisma.client.update({
    where: { id: clientId },
    data: { revenueAssigneeId: userId }
  })
  revalidatePath('/revenue')
}
