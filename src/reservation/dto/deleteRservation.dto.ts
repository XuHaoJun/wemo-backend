import { SqlNumberId, SqlUuidV7 } from 'src/common/class-validator-ext';

export class DeleteReservationParamsDto {
  @SqlUuidV7()
  id: string;
}

export class DeleteReservationDto {
  @SqlNumberId()
  userId: number;
}
