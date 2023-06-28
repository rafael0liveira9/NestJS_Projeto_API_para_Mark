import { Module } from '@nestjs/common';
import { SendImagesService } from './send-images.service';
import { SendImagesController } from './send-images.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { UploaderService } from 'src/singleServices/uploader.service';

@Module({
  controllers: [SendImagesController],
  providers: [SendImagesService, JwtService, PrismaService, UploaderService],
})
export class SendImagesModule {}
