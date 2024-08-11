import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { NearestScootersDto } from './dto/nearestScooters.dto';

@Injectable()
export class ScooterService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // use redis GEORADIUS with key scooter:location
  // find scooters in a certain radius(500m) of a certain location(body.lat, body.lng)
  // limit 100 scooters
  async nearestScooters(body: NearestScootersDto) {
    const scooters = await this.redis.georadius(
      'scooter:location',
      body.lng,
      body.lat,
      500,
      'm',
      'WITHDIST',
      'WITHCOORD',
      'ASC',
      'COUNT',
      100,
    );
    return scooters.map((foo: any[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [scooterId, distance, coords] = foo;
      return {
        scooterId: parseInt(scooterId, 10),
        distance: parseFloat(distance),
        coords: {
          lng: parseFloat(coords[0]),
          lat: parseFloat(coords[1]),
        },
      };
    });
  }
}
