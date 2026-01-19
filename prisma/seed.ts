import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Создаём категории
  const cherniy = await prisma.category.create({
    data: {
      name: 'Чёрный металлопрокат',
      slug: 'cherniy-metalloprokat',
      description: 'Листовой и сортовой прокат из углеродистой стали',
      order: 1,
    },
  })

  const nerzhaveyka = await prisma.category.create({
    data: {
      name: 'Нержавеющая сталь',
      slug: 'nerzhaveyka',
      description: 'Нержавеющий металлопрокат',
      order: 2,
    },
  })

  const armatura = await prisma.category.create({
    data: {
      name: 'Трубопроводная арматура',
      slug: 'truboprovodnaya-armatura',
      description: 'Запорная и регулирующая арматура',
      order: 3,
    },
  })

  // Подкатегории
  const listy = await prisma.category.create({
    data: {
      name: 'Листы стальные',
      slug: 'listy-stalnye',
      parentId: cherniy.id,
      order: 1,
    },
  })

  const armaturaRod = await prisma.category.create({
    data: {
      name: 'Арматура',
      slug: 'armatura',
      parentId: cherniy.id,
      order: 2,
    },
  })

  const shveller = await prisma.category.create({
    data: {
      name: 'Швеллер',
      slug: 'shveller',
      parentId: cherniy.id,
      order: 3,
    },
  })

  const ugolok = await prisma.category.create({
    data: {
      name: 'Уголок',
      slug: 'ugolok',
      parentId: cherniy.id,
      order: 4,
    },
  })

  // Товары
  const products = [
    {
      name: 'Лист стальной г/к 2мм',
      slug: 'list-stalnoy-gk-2mm',
      description: 'Лист стальной горячекатаный толщиной 2мм, размер 1250x2500мм',
      price: 45000,
      unit: 'лист',
      categoryId: listy.id,
      specifications: { 'Толщина': '2 мм', 'Размер': '1250x2500 мм', 'Марка': 'Ст3' },
    },
    {
      name: 'Лист стальной г/к 3мм',
      slug: 'list-stalnoy-gk-3mm',
      description: 'Лист стальной горячекатаный толщиной 3мм, размер 1250x2500мм',
      price: 67500,
      unit: 'лист',
      categoryId: listy.id,
      specifications: { 'Толщина': '3 мм', 'Размер': '1250x2500 мм', 'Марка': 'Ст3' },
    },
    {
      name: 'Лист стальной г/к 4мм',
      slug: 'list-stalnoy-gk-4mm',
      description: 'Лист стальной горячекатаный толщиной 4мм, размер 1500x6000мм',
      price: 120000,
      unit: 'лист',
      categoryId: listy.id,
      specifications: { 'Толщина': '4 мм', 'Размер': '1500x6000 мм', 'Марка': 'Ст3' },
    },
    {
      name: 'Арматура А500С d12',
      slug: 'armatura-a500s-d12',
      description: 'Арматура класса А500С диаметром 12мм',
      price: 380,
      unit: 'кг',
      categoryId: armaturaRod.id,
      specifications: { 'Диаметр': '12 мм', 'Класс': 'А500С', 'Длина': '11.7 м' },
    },
    {
      name: 'Арматура А500С d16',
      slug: 'armatura-a500s-d16',
      description: 'Арматура класса А500С диаметром 16мм',
      price: 375,
      unit: 'кг',
      categoryId: armaturaRod.id,
      specifications: { 'Диаметр': '16 мм', 'Класс': 'А500С', 'Длина': '11.7 м' },
    },
    {
      name: 'Швеллер 10П',
      slug: 'shveller-10p',
      description: 'Швеллер стальной горячекатаный 10П',
      price: 52000,
      unit: 'т',
      categoryId: shveller.id,
      specifications: { 'Номер': '10П', 'Марка': 'Ст3', 'Длина': '12 м' },
    },
    {
      name: 'Уголок 50x50x5',
      slug: 'ugolok-50x50x5',
      description: 'Уголок стальной равнополочный 50x50x5',
      price: 48000,
      unit: 'т',
      categoryId: ugolok.id,
      specifications: { 'Размер': '50x50x5 мм', 'Марка': 'Ст3', 'Длина': '6 м' },
    },
    {
      name: 'Уголок 63x63x6',
      slug: 'ugolok-63x63x6',
      description: 'Уголок стальной равнополочный 63x63x6',
      price: 49000,
      unit: 'т',
      categoryId: ugolok.id,
      specifications: { 'Размер': '63x63x6 мм', 'Марка': 'Ст3', 'Длина': '6 м' },
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
