import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  })
  console.log("USERS:", users)

  const stores = await prisma.store.findMany()
  console.log("STORES COUNT:", stores.length)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
