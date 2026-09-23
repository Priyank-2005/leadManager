'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addMeet(data: { leadId: string, title: string, date: Date }) {
  await prisma.meet.create({ data })
  revalidatePath('/', 'layout')
}

export async function deleteMeet(id: string) {
  await prisma.meet.delete({ where: { id } })
  revalidatePath('/', 'layout')
}

export async function toggleMeetStatus(id: string, status: string) {
  await prisma.meet.update({ where: { id }, data: { status } })
  revalidatePath('/', 'layout')
}

export async function updateMeetDate(id: string, date: Date) {
  await prisma.meet.update({ where: { id }, data: { date } })
  revalidatePath('/', 'layout')
}
