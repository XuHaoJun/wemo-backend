import { Body, Controller, Patch, Post } from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/createRent.dto';
import { ReturnRentDto } from './dto/returnRent.dto';

@Controller('rents')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  async createRent(@Body() body: CreateRentDto) {
    return this.rentService.rent(body);
  }

  @Patch('return')
  async rentReturn(@Body() body: ReturnRentDto) {
    return this.rentService.return(body);
  }
}
