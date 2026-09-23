import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.client.updateMany({
    where: { name: 'Knowith Capital' },
    data: { liveDate: null }
  })
  console.log(`Updated ${result.count} clients`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
