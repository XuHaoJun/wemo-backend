import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRentDto } from './dto/createRent.dto';
import { ReturnRentDto } from './dto/returnRent.dto';

@Injectable()
export class RentService {
  constructor(private readonly prisma: PrismaService) {}
  async rent(body: CreateRentDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const rent = await prisma.rent.create({
        data: {
          startDate: new Date(),
          userId: body.userId,
          scooterId: body.scooterId,
        },
      });

      const userUpdateResult = await prisma.user.updateMany({
        where: { id: body.userId, activeRentId: null },
        data: { activeRentId: rent.id },
      });
      if (userUpdateResult.count === 0) {
        throw new Error('TODO');
      }

      const scooterUpdateResult = await prisma.scooter.updateMany({
        where: { id: body.scooterId, rentAble: true, activeRentId: null },
        data: { rentAble: false, activeRentId: rent.id },
      });
      if (scooterUpdateResult.count === 0) {
        throw new Error('TODO');
      }

      return { rent };
    });

    return result.rent;
  }

  async return(body: ReturnRentDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: body.userId,
        },
        include: { activeRent: true },
      });
      const errors: any[] = [];
      if (user.activeRentId === null) {
        // TODO
        // 沒有租借中,但想還車？應紀錄log
        errors.push(new Error('User has no active rent'));
      }
      if (user.activeRent.scooterId !== body.scooterId) {
        // TODO
        // 租借中,但還到別台車？應紀錄log
        errors.push(new Error('User return incorrect scooter'));
      }
      if (errors.length > 0) {
        throw new Error('TODO');
      }

      const updatedUser = await prisma.user.update({
        where: { id: body.userId, activeRentId: user.activeRentId },
        data: {
          activeRentId: null,
        },
      });

      const updatedScooter = await prisma.scooter.update({
        where: { id: body.scooterId, activeRentId: user.activeRentId },
        data: {
          activeRentId: null,
          rentAble: true,
        },
      });

      const updatedRent = await prisma.rent.update({
        where: { id: user.activeRentId },
        data: {
          endDate: new Date(),
        },
      });

      return {
        user,
        updatedUser,
        updatedScooter,
        updatedRent,
      };
    });
    return result.updatedRent;
  }
}
