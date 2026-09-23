import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const clients = await prisma.client.findMany()

  for (const c of clients) {
    if (c.name.toLowerCase().includes('knowith')) {
      await prisma.client.update({
        where: { id: c.id },
        data: { createdAt: new Date('2026-07-25T12:00:00Z') }
      })
    }
    if (c.name.toLowerCase().includes('treasure')) {
      await prisma.client.update({
        where: { id: c.id },
        data: { createdAt: new Date('2026-08-21T12:00:00Z') }
      })
    }
    if (c.name.toLowerCase().includes('rebel')) {
      await prisma.client.update({
        where: { id: c.id },
        data: { createdAt: new Date('2026-09-10T12:00:00Z') }
      })
    }
  }

  console.log('Dates updated')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
