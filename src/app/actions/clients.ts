'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  return await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { messages: { select: { isRead: true, userId: true } } }
  })
}

export async function createClient(data: {
  name: string
  businessType?: string
  instagramUrl?: string
  websiteUrl?: string
  agreedPrice: number
  projectDetails?: string
  liveDate?: Date
}) {
  const client = await prisma.client.create({
    data
  })
  revalidatePath('/')
  return client
}

export async function updateClient(id: string, data: Partial<{
  name: string
  businessType: string
  instagramUrl: string
  websiteUrl: string
  agreedPrice: number
  projectDetails: string
  liveDate: Date | null
}>) {
  const client = await prisma.client.update({
    where: { id },
    data
  })
  revalidatePath('/', 'layout')
  return client
}

export async function deleteClient(id: string) {
  await prisma.client.delete({
    where: { id }
  })
  revalidatePath('/', 'layout')
}
