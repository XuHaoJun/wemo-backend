import { SqlNumberId } from 'src/common/class-validator-ext';

export class ReturnRentDto {
  @SqlNumberId()
  userId: number;

  @SqlNumberId()
  scooterId: number;
}
