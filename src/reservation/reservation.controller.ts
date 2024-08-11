import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createRservation.dto';
import {
  DeleteReservationDto,
  DeleteReservationParamsDto,
} from './dto/deleteRservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() body: CreateReservationDto) {
    return this.reservationService.reserve(body);
  }

  @Delete(':id')
  async deleteReservation(
    @Param() params: DeleteReservationParamsDto,
    @Body() body: DeleteReservationDto,
  ) {
    return this.reservationService.cancel(params.id, body);
  }
}
