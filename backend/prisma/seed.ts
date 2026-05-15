import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingViaturas = await prisma.viatura.count();

  if (existingViaturas > 0) {
    console.log('Seed skipped: viaturas table already has data.');
    return;
  }

  const viaturas = [
    'Ford Transit - 32-AB-10',
    'Renault Kangoo - 88-CD-21',
    'Peugeot Partner - 74-EF-45',
    'Toyota Hilux - 19-GH-82',
  ];

  for (const Nome of viaturas) {
    const exists = await prisma.viatura.findFirst({ where: { Nome } });

    if (!exists) {
      await prisma.viatura.create({ data: { Nome } });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
