import { LoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';
import { RentModule } from './rent/rent.module';
import { ReservationModule } from './reservation/reservation.module';
import { ScooterModule } from './scooter/scooter.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // install 'pino-pretty' package in order to use the following option
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        // and all the other fields of:
        // - https://github.com/pinojs/pino-http#api
        // - https://github.com/pinojs/pino/blob/HEAD/docs/api.md#options-object
      },
    }),
    //
    RentModule,
    ReservationModule,
    ScooterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
