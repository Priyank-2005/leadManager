'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getMessages(query: { leadId?: string, clientId?: string }) {
  return await prisma.message.findMany({
    where: query,
    include: {
      user: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'asc' }
  })
}

export async function sendMessage(data: {
  text?: string
  imageUrl?: string
  fileName?: string
  userId: string
  leadId?: string
  clientId?: string
}) {
  const msg = await prisma.message.create({
    data
  })
  
  if (data.leadId) {
    revalidatePath(`/leads/${data.leadId}`)
  } else if (data.clientId) {
    revalidatePath(`/clients/${data.clientId}`)
  }
  return msg
}

export async function deleteMessage(messageId: string, leadId?: string, clientId?: string) {
  await prisma.message.delete({ where: { id: messageId } })
  if (leadId) revalidatePath(`/leads/${leadId}`)
  if (clientId) revalidatePath(`/clients/${clientId}`)
}

export async function markMessagesAsRead(userId: string, leadId?: string, clientId?: string) {
  if (leadId) {
    await prisma.message.updateMany({
      where: { leadId, userId: { not: userId }, isRead: false },
      data: { isRead: true }
    })
    revalidatePath(`/leads`)
    revalidatePath(`/leads/${leadId}`)
  }
  if (clientId) {
    await prisma.message.updateMany({
      where: { clientId, userId: { not: userId }, isRead: false },
      data: { isRead: true }
    })
    revalidatePath(`/clients`)
    revalidatePath(`/clients/${clientId}`)
  }
}
