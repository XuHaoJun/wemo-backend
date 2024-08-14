import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  for (let i = 0; i < 10000; i++) {
    const values = [];
    for (let j = 0; j < 100; j++) {
      const { latitude, longitude } = getRandomCoordinate();
      const point = `POINT(${longitude} ${latitude})`;
      values.push(`(true, ST_GeomFromText('${point}', 4326))`);
    }
    const sql = `INSERT INTO "Scooter" ("rentAble", "coords") VALUES ${values.join(', ')}`;
    await prisma.$executeRawUnsafe(sql);
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
