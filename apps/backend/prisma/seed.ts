import { PrismaClient } from '@prisma/client';
import { ACHIEVEMENTS_SEED } from '@arabic/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding achievements...');
  for (const ach of ACHIEVEMENTS_SEED) {
    await prisma.achievement.upsert({
      where: { key: ach.key },
      update: {},
      create: {
        key: ach.key,
        nameRu: ach.nameRu,
        nameUz: ach.nameUz,
        nameEn: ach.nameEn,
        descRu: ach.descRu,
        descUz: ach.descUz,
        descEn: ach.descEn,
        icon: ach.icon,
        condition: ach.condition,
      },
    });
  }
  console.log(`✅ Seeded ${ACHIEVEMENTS_SEED.length} achievements`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
