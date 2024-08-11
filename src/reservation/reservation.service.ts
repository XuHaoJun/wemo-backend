import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReservationDto } from './dto/createRservation.dto';
import { DeleteReservationDto } from './dto/deleteRservation.dto';
import dayjs from 'dayjs';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(body: CreateReservationDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const now = new Date();
      const expiredAt = dayjs(now).add(10, 'minute');
      const reservation = await prisma.reservation.create({
        data: {
          expiredAt: expiredAt.toDate(),
          userId: body.userId,
          scooterId: body.scooterId,
        },
      });

      const userUpdateResult = await prisma.user.updateMany({
        where: {
          AND: [
            {
              id: body.userId,
              activeRentId: null,
            },
            {
              OR: [
                {
                  activeReservationId: null,
                },
                {
                  activeReservation: {
                    expiredAt: { gte: now },
                  },
                },
              ],
            },
          ],
        },
        data: { activeReservationId: reservation.id },
      });
      if (userUpdateResult.count === 0) {
        throw new BadRequestException('User has active rent or areservation');
      }

      const scooterUpdateResult = await prisma.scooter.updateMany({
        where: {
          AND: [
            {
              id: body.scooterId,
              rentAble: true,
              activeRentId: null,
            },
            {
              OR: [
                {
                  activeReservationId: null,
                },
                {
                  activeReservation: {
                    expiredAt: { gte: now },
                  },
                },
              ],
            },
          ],
        },
        data: {
          activeReservationId: reservation.id,
        },
      });
      if (scooterUpdateResult.count === 0) {
        throw new BadRequestException('Scooter is not reservable');
      }

      return {
        reservation,
      };
    });
    return result.reservation;
  }

  async cancel(id: string, body: DeleteReservationDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const userUpdateResult = await prisma.user.updateMany({
        where: {
          id: body.userId,
          activeReservationId: id,
        },
        data: {
          activeReservationId: null,
        },
      });
      if (userUpdateResult.count === 0) {
        throw new BadRequestException(
          'User no reservation or incorrect active reservation',
        );
      }
      const scooterUpdateResult = await prisma.scooter.updateMany({
        where: {
          activeReservationId: id,
          activeRent: {
            userId: body.userId,
          },
        },
        data: {
          activeReservationId: null,
        },
      });
      if (scooterUpdateResult.count === 0) {
        throw new BadRequestException(
          'Scooter no reservation or incorrect active reservation',
        );
      }
      // TODO
      // 考慮軟刪除？
      const deletedReservation = await prisma.reservation.delete({
        where: {
          id,
          userId: body.userId,
        },
      });
      return {
        deletedReservation,
      };
    });
    return result.deletedReservation;
  }
}
