import { Injectable } from '@nestjs/common';
import { PrismaService } from '../singleServices/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'OK!';
  }

  sendHello() {
    return { Oi: 'Oi' };
  }

  async getUserData() {
    return await this.prisma.user.findMany({});
  }
}
