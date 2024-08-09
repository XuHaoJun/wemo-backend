import { Id } from 'src/common/class-validator-ext';

export class ReturnRentDto {
  @Id()
  userId: number;

  @Id()
  scooterId: number;
}
