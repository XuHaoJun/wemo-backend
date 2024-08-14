import { PrismaClient, Prisma } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  for (let i = 0; i < 1000000; i++) {
    const { latitude, longitude } = getRandomCoordinate();
    console.log(`(${longitude.toFixed(3)} ${latitude.toFixed(3)})`);
    const sql = Prisma.sql`INSERT INTO "Scooter" ("rentAble", "coords") VALUES (true, ST_GeomFromText('POINT(${longitude.toFixed(1)} ${latitude.toFixed(1)})', 4326))`;
    await prisma.$queryRaw(sql);
  }
}

function getRandomCoordinate() {
  // 台灣範圍內的經緯度範圍
  const minLat = 21.8;
  const maxLat = 25.3;
  const minLng = 119.5;
  const maxLng = 122.0;

  // 生成隨機緯度和經度
  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLng - minLng) + maxLng;

  return { latitude, longitude };
}

main();
