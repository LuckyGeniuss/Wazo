import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userId = '654429b5-1ee9-4ab1-9b81-41122d5f54b5' // sergey.varava@gmail.com
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  
  console.log("Found user role:", user?.role)
  
  const storesUndefined = await prisma.store.findMany({
    where: undefined,
  })
  
  console.log("Stores with where: undefined => count:", storesUndefined.length)

  const storesEmpty = await prisma.store.findMany({
    where: {},
  })
  
  console.log("Stores with where: {} => count:", storesEmpty.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())
