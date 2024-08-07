import { Id } from 'src/common/class-validator-ext';

export class CreateRentDto {
  @Id()
  userId: number;

  @Id()
  scooterId: number;
}
