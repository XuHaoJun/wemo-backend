import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis.module';
import { ScooterController } from './scooter.controller';
import { ScooterService } from './scooter.service';

@Module({
  imports: [RedisModule],
  controllers: [ScooterController],
  providers: [ScooterService],
  exports: [ScooterService],
})
export class ScooterModule {}
