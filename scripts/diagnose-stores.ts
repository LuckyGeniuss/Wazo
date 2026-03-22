import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== КРОК 1: Перевірка користувачів в БД ===\n')
  
  // Отримуємо всіх користувачів
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  console.log('Користувачі в БД:')
  console.table(users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  })))

  // Знаходимо SuperAdmin
  const superAdmin = users.find(u => u.email === 'sergey.varava@gmail.com')
  console.log('\n=== SuperAdmin ===')
  if (superAdmin) {
    console.log(`ID: ${superAdmin.id}`)
    console.log(`Email: ${superAdmin.email}`)
    console.log(`Role: ${superAdmin.role}`)
  } else {
    console.log('SuperAdmin не знайдено!')
  }

  console.log('\n=== КРОК 2: Перевірка магазинів та їх ownerId ===\n')
  
  // Отримуємо всі магазини
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      ownerId: true,
      status: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  console.log('Магазини в БД:')
  console.table(stores.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    ownerId: s.ownerId,
    status: s.status,
    isVerified: s.isVerified,
    createdAt: s.createdAt,
    matchesSuperAdmin: s.ownerId === superAdmin?.id ? '✅' : '❌',
  })))

  // Перевіряємо які магазини мають неправильний ownerId
  const mismatchedStores = stores.filter(s => s.ownerId !== superAdmin?.id)
  
  console.log('\n=== ПІДСУМКИ ===')
  console.log(`Всього користувачів: ${users.length}`)
  console.log(`Всього магазинів: ${stores.length}`)
  console.log(`Магазинів з неправильним ownerId: ${mismatchedStores.length}`)
  
  if (mismatchedStores.length > 0) {
    console.log('\nМагазини з неправильним ownerId (потребують виправлення):')
    console.table(mismatchedStores.map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      currentOwnerId: s.ownerId,
      expectedOwnerId: superAdmin?.id,
    })))
  }

  return {
    superAdmin,
    stores,
    mismatchedStores,
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
