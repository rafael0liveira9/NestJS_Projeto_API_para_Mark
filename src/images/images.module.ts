import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, JwtService, PrismaService],
})
export class ImagesModule {}
