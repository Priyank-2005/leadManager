'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addMilestone(data: { clientId: string, title: string, amount: number, dueDate?: Date }) {
  await prisma.paymentMilestone.create({ data })
  revalidatePath(`/clients/${data.clientId}`)
}

export async function toggleMilestone(id: string, clientId: string, isPaid: boolean) {
  await prisma.paymentMilestone.update({
    where: { id },
    data: { isPaid }
  })
  
  // Calculate total received and update client
  const milestones = await prisma.paymentMilestone.findMany({ where: { clientId, isPaid: true } })
  const amountReceived = milestones.reduce((sum, m) => sum + m.amount, 0)
  
  await prisma.client.update({
    where: { id: clientId },
    data: { amountReceived }
  })
  
  revalidatePath(`/clients/${clientId}`)
}

export async function deleteMilestone(id: string, clientId: string) {
  await prisma.paymentMilestone.delete({ where: { id } })
  
  const milestones = await prisma.paymentMilestone.findMany({ where: { clientId, isPaid: true } })
  const amountReceived = milestones.reduce((sum, m) => sum + m.amount, 0)
  
  await prisma.client.update({
    where: { id: clientId },
    data: { amountReceived }
  })
  
  revalidatePath(`/clients/${clientId}`)
}
