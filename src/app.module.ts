import { Module } from '@nestjs/common';
import { RentModule } from './rent/rent.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [RentModule, ReservationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
