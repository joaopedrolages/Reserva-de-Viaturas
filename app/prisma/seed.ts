import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const configuredViaturas =
    process.env.SEED_VIATURAS?.split(',')
      .map((Nome) => Nome.trim())
      .filter(Boolean) ?? [];

  if (configuredViaturas.length === 0) {
    console.log(
      'Seed skipped: set SEED_VIATURAS with comma-separated vehicle names to insert data.',
    );
    return;
  }

  const existingViaturas = await prisma.viatura.count();

  if (existingViaturas > 0) {
    console.log('Seed skipped: viaturas table already has data.');
    return;
  }

  for (const Nome of configuredViaturas) {
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
