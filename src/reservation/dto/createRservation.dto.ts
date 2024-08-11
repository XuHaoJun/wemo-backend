import { SqlNumberId } from 'src/common/class-validator-ext';

export class CreateReservationDto {
  @SqlNumberId()
  userId: number;

  @SqlNumberId()
  scooterId: number;
}
