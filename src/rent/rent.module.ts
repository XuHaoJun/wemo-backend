import { Module } from '@nestjs/common';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RentController],
  providers: [RentService],
  exports: [RentService],
})
export class RentModule {}
