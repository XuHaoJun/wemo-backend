import { PrismaClient } from '@prisma/client';
import * as R from 'remeda';
import dayjs from 'dayjs';
import { v7 as uuidV7 } from 'uuid';

async function main() {
  const prisma = new PrismaClient();
  const now = new Date();

  await prisma.user.createMany({
    data: R.range(1, 20 + 1).map(() => ({
      activeRentId: null,
    })),
  });

  await prisma.scooter.createMany({
    data: R.range(1, 10 + 1).map(() => ({
      rentAble: true,
      activeRentId: null,
    })),
  });

  const reservationsData = [
    {
      id: uuidV7(),
      userId: 1,
      scooterId: 1,
      expiredAt: dayjs(now).subtract(1, 'year').toDate(),
    },
    {
      id: uuidV7(),
      userId: 2,
      scooterId: 2,
      expiredAt: dayjs(now).add(1, 'year').toDate(),
    },
  ];
  await prisma.reservation.createMany({
    data: reservationsData,
  });

  for (const x of reservationsData) {
    await prisma.user.update({
      where: { id: x.userId },
      data: {
        activeReservationId: x.id,
      },
    });
  }
}

main();
