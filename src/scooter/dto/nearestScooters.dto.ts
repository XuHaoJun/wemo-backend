import { IsNumber } from 'class-validator';

export class NearestScootersDto {
  @IsNumber()
  lng: number;
  @IsNumber()
  lat: number;
}
