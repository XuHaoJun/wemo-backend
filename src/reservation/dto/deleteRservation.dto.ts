import { SqlNumberId, SqlUuid } from 'src/common/class-validator-ext';

export class DeleteReservationParamsDto {
  @SqlUuid()
  id: string;
}

export class DeleteReservationDto {
  @SqlNumberId()
  userId: number;
}
