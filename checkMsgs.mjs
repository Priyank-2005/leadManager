import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const msgs = await prisma.message.findMany()
  console.log(msgs.map(m => ({ url: m.imageUrl, name: m.fileName })))
}

main().finally(() => prisma.$disconnect())
