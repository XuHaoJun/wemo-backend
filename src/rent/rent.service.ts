import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRentDto } from './dto/createRent.dto';
import { ReturnRentDto } from './dto/returnRent.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RentService {
  constructor(private readonly prisma: PrismaService) {}
  async rent(body: CreateRentDto) {
    const result = await this.prisma.$transaction(async (prisma) => {
      const now = new Date();

      const rent = await prisma.rent.create({
        data: {
          startDate: now,
          userId: body.userId,
          scooterId: body.scooterId,
        },
      });

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: body.userId,
        },
      });
      if (user.activeReservationId) {
        try {
          await prisma.reservation.update({
            where: {
              id: user.activeReservationId,
              expiredAt: { gte: now },
              scooterId: body.scooterId,
            },
            data: { rentId: rent.id },
          });
        } catch (e: any) {
          // TODO
          // should check error
          throw new BadRequestException(
            'User reservation has expired or incorrect scooter',
          );
        }
      }

      const userUpdateResult = await prisma.user.updateMany({
        where: {
          AND: [
            { id: body.userId, activeRentId: null },
            {
              OR: [
                {
                  activeReservationId: null,
                },
                {
                  activeReservationId: user.activeReservationId,
                  activeReservation: {
                    expiredAt: { gte: now },
                  },
                },
              ],
            },
          ],
        },
        data: { activeRentId: rent.id, activeReservationId: null },
      });
      if (userUpdateResult.count === 0) {
        throw new BadRequestException(
          'User has active rent or incorrect reservation',
        );
      }

      const scooterUpdateResult = await prisma.scooter.updateMany({
        where: {
          AND: [
            { id: body.scooterId, rentAble: true, activeRentId: null },
            {
              OR: [
                {
                  activeReservationId: null,
                },
                {
                  activeReservationId: user.activeReservationId,
                  activeReservation: {
                    expiredAt: { gte: now },
                  },
                },
              ],
            },
          ],
        },
        data: {
          rentAble: false,
          activeRentId: rent.id,
          activeReservationId: null,
        },
      });
      if (scooterUpdateResult.count === 0) {
        throw new BadRequestException('Scooter is not rentable');
      }

      return { rent };
    });

    return result.rent;
  }

  async rent2(body: CreateRentDto) {
    const result = await this.prisma.$transaction(
      async (prisma) => {
        const now = new Date();

        const rent = await prisma.rent.create({
          data: {
            startDate: now,
            userId: body.userId,
            scooterId: body.scooterId,
          },
        });

        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: body.userId,
          },
          include: { activeReservation: true },
        });
        if (user.activeReservationId) {
          try {
            await prisma.reservation.update({
              where: {
                id: user.activeReservationId,
                expiredAt: { gte: now },
                scooterId: body.scooterId,
              },
              data: { rentId: rent.id },
            });
          } catch (e: any) {
            // TODO
            // should check error
            throw new BadRequestException(
              'User reservation has expired or incorrect scooter',
            );
          }
        }

        if (
          user.activeRentId !== null ||
          (user.activeReservationId !== null &&
            (user.activeReservation.scooterId !== body.scooterId ||
              user.activeReservation.expiredAt < now))
        ) {
          throw new BadRequestException(
            'User has active rent or incorrect reservation',
          );
        }

        const scooter = await prisma.scooter.findUniqueOrThrow({
          where: {
            id: body.scooterId,
          },
        });
        if (
          !scooter.rentAble ||
          (scooter.activeRentId != null &&
            scooter.activeReservationId !== user.activeReservationId)
        ) {
          throw new BadRequestException('Scooter is not rentable');
        }

        return { rent };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

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
      } else if (user.activeRent.scooterId !== body.scooterId) {
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
