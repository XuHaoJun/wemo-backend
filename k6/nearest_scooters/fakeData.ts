import Redis from 'ioredis';

async function main() {
  const redis = new Redis({
    host: 'localhost',
    port: 6379,
    password: 'redis',
  });
  const ps: any[] = [];
  for (let i = 1; i <= 1000000; i++) {
    const { latitude, longitude } = getRandomCoordinate();
    const p = redis.geoadd(
      'scooter:location',
      longitude,
      latitude,
      i.toString(),
    );
    ps.push(p);
  }
  await Promise.all(ps);
  redis.disconnect();
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
