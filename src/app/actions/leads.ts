'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getLeads() {
  return await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { meets: true, messages: { select: { isRead: true, userId: true } } }
  })
}

export async function createLead(data: {
  name: string
  businessType?: string
  status?: string
  lastUpdate?: string
  instagramUrl?: string
  nextFollowUp?: Date
  conversionProbability?: number
}) {
  const lead = await prisma.lead.create({
    data: {
      ...data,
      conversionProbability: data.conversionProbability || 0
    }
  })
  revalidatePath('/')
  return lead
}

export async function updateLead(id: string, data: Partial<{
  name: string
  businessType: string
  status: string
  lastUpdate: string
  instagramUrl: string
  nextFollowUp: Date | null
  conversionProbability: number
}>) {
  if (data.status === 'WON') {
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (lead) {
      await prisma.client.create({
        data: {
          name: lead.name,
          businessType: lead.businessType,
          instagramUrl: lead.instagramUrl,
          agreedPrice: 0,
        }
      })
      await prisma.lead.delete({ where: { id } })
      revalidatePath('/', 'layout')
      return null
    }
  }

  const lead = await prisma.lead.update({
    where: { id },
    data
  })
  revalidatePath('/', 'layout')
  return lead
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({
    where: { id }
  })
  revalidatePath('/', 'layout')
}
