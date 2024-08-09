import { PrismaClient } from '@prisma/client';
import * as R from 'remeda';

async function main() {
  const prisma = new PrismaClient();
  await prisma.user.createMany({
    data: R.range(0, 100000).map(() => ({ activeRentId: null })),
  });
  await prisma.scooter.createMany({
    data: R.range(0, 10).map(() => ({
      rentAble: true,
      activeRentId: null,
    })),
  });
}

main();
