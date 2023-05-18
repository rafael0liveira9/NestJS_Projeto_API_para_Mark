import { Injectable } from '@nestjs/common';
import { PrismaService } from '../singleServices/prisma.service';

@Injectable()
export class AppService {
  getOk(): string {
    return 'OK!';
  }
}
