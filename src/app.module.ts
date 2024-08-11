import { Module } from '@nestjs/common';
import { RentModule } from './rent/rent.module';
import { ReservationModule } from './reservation/reservation.module';
import { ScooterModule } from './scooter/scooter.module';

@Module({
  imports: [RentModule, ReservationModule, ScooterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
