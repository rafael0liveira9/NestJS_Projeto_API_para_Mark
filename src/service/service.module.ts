import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, PrismaService, JwtService],
})
export class ServiceModule {}
