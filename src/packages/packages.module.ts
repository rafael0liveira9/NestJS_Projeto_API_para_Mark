import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, JwtService, PrismaService],
})
export class PackagesModule {}
