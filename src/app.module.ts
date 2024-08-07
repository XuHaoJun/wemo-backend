import { Module } from '@nestjs/common';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [RentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
