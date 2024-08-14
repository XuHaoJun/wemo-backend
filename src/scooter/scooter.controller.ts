import { Body, Controller, Post } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { NearestScootersDto } from './dto/nearestScooters.dto';

@Controller('scooters')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Post('search/nearest')
  async nearestScooters(@Body() body: NearestScootersDto) {
    return this.scooterService.nearestScooters(body);
  }

  @Post('search/nearest2')
  async nearestScooters2(@Body() body: NearestScootersDto) {
    return this.scooterService.nearestScooters2(body);
  }
}
