import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log:
        process.env.PRISMA_LOG_QUERIES === 'true'
          ? ['query', 'info', 'warn', 'error']
          : [],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
