import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcryptjs.hash('admin123', 10)
  await prisma.user.update({
    where: { email: 'sergey.varava@gmail.com' },
    data: { password: hash }
  })
  console.log("Password updated!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
