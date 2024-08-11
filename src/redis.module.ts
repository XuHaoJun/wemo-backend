import { RedisModule as RedisModuleOri } from '@nestjs-modules/ioredis';

export const RedisModule = RedisModuleOri.forRoot({
  type: 'single',
  url: process.env.REDIS_URL || 'redis://:redis@localhost:6379',
});
