import { SqlNumberId } from 'src/common/class-validator-ext';

export class CreateRentDto {
  @SqlNumberId()
  userId: number;

  @SqlNumberId()
  scooterId: number;
}
