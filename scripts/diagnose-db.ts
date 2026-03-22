import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== КРОК 1-4: Діагностика БД ===\n')
  
  // 1. Перевірка ролі SuperAdmin
  console.log('--- 1. Перевірка ролі користувача sergey.varava@gmail.com ---')
  const superAdmin = await prisma.user.findUnique({
    where: { email: 'sergey.varava@gmail.com' },
    select: { id: true, email: true, role: true },
  })
  
  if (!superAdmin) {
    console.error('❌ SuperAdmin не знайдено!')
  } else {
    console.log(`ID: ${superAdmin.id}`)
    console.log(`Email: ${superAdmin.email}`)
    console.log(`Role: ${superAdmin.role}`)
    console.log(superAdmin.role === 'SUPERADMIN' ? '✅ Role = SUPERADMIN' : `❌ Role = ${superAdmin.role} (очікувався SUPERADMIN)`)
  }
  
  console.log('\n--- 2. Перевірка ownerId магазинів ---')
  
  // 2. Перевірка всіх магазинів та їхніх ownerId
  const stores = await prisma.store.findMany({
    select: { id: true, name: true, slug: true, ownerId: true },
  })
  
  console.log(`Всього магазинів: ${stores.length}\n`)
  
  if (stores.length > 0) {
    console.table(stores.map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      ownerId: s.ownerId,
      isSuperAdminOwner: s.ownerId === superAdmin?.id ? '✅' : '❌',
    })))
  }
  
  // 3. Перевірка на наявність магазинів з неправильним ownerId
  console.log('\n--- 3. Перевірка на неправильні ownerId ---')
  const oldOwnerId = 'bbd18fa0-4b83-4afa-872d-b1df0b0c0c03'
  const storesWithOldOwnerId = stores.filter(s => s.ownerId === oldOwnerId)
  
  if (storesWithOldOwnerId.length > 0) {
    console.log(`⚠️  Знайдено ${storesWithOldOwnerId.length} магазинів з неправильним ownerId (${oldOwnerId}):`)
    console.table(storesWithOldOwnerId.map(s => ({ id: s.id, name: s.name, slug: s.slug })))
  } else {
    console.log('✅ Немає магазинів з неправильним ownerId')
  }
  
  // 4. Підсумок
  console.log('\n--- 4. Підсумок ---')
  if (superAdmin && stores.length > 0) {
    const allCorrect = stores.every(s => s.ownerId === superAdmin.id)
    console.log(allCorrect ? '✅ Всі магазини належать SuperAdmin' : `❌ Деякі магазини мають неправильний ownerId`)
  }
}

main()
  .catch((e) => {
    console.error('Помилка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
