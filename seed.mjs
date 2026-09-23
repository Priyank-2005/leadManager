import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  
  const passwordHash = await bcrypt.hash('Password@123', 10)

  const user1 = await prisma.user.create({
    data: {
      name: 'Priyank',
      email: 'priyank.bohra.31@gmail.com',
      phone: '9824072405',
      password: passwordHash
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Ayushi',
      email: 'ayushisainani@gmail.com',
      phone: '6378035591',
      password: passwordHash
    }
  })

  console.log('Seed completed!', user1, user2)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
