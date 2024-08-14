import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { NearestScootersDto } from './dto/nearestScooters.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

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

  async nearestScooters2(body: NearestScootersDto) {
    const result = await this.prisma.$queryRaw`
      SELECT id, ST_Distance(coords::geography, ST_SetSRID(ST_MakePoint(${body.lng}, ${body.lat}), 4326)::geography) AS distance
      FROM "Scooter"
      WHERE ST_DWithin(
          coords::geography,
          ST_SetSRID(ST_MakePoint(${body.lng}, ${body.lat}), 4326)::geography,
          500
      )
      ORDER BY distance
      LIMIT 100
    `;
    return result;
  }
}
