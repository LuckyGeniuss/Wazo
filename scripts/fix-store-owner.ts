import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== КРОК 3: Виправлення ownerId магазинів ===\n')
  
  // Знаходимо поточного SuperAdmin
  const superAdmin = await prisma.user.findUnique({
    where: { email: 'sergey.varava@gmail.com' },
    select: { id: true, email: true },
  })

  if (!superAdmin) {
    console.error('Помилка: SuperAdmin не знайдено!')
    process.exit(1)
  }

  console.log(`SuperAdmin ID: ${superAdmin.id}`)
  console.log(`SuperAdmin Email: ${superAdmin.email}\n`)

  // Отримуємо всі магазини з поточним неправильним ownerId
  const oldOwnerId = 'bbd18fa0-4b83-4afa-872d-b1df0b0c0c03'
  
  const storesToUpdate = await prisma.store.findMany({
    where: { ownerId: oldOwnerId },
    select: { id: true, name: true, slug: true },
  })

  console.log(`Знайдено магазинів для оновлення: ${storesToUpdate.length}\n`)

  if (storesToUpdate.length === 0) {
    console.log('Немає магазинів для оновлення.')
    return
  }

  // Оновлюємо ownerId для всіх магазинів
  const updatePromises = storesToUpdate.map(store => 
    prisma.store.update({
      where: { id: store.id },
      data: { ownerId: superAdmin.id },
    })
  )

  const results = await Promise.all(updatePromises)

  console.log('=== Результат оновлення ===\n')
  console.table(storesToUpdate.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    status: '✅ Оновлено',
  })))

  console.log(`\nУспішно оновлено ${results.length} магазинів.`)
  console.log(`Новий ownerId: ${superAdmin.id}`)
}

main()
  .catch((e) => {
    console.error('Помилка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
