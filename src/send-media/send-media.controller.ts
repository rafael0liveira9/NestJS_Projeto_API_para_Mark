import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { SendImagesService } from './send-media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/singleServices/prisma.service';

@Controller('send-media')
export class SendImagesController {
  constructor(
    private readonly sendImagesService: SendImagesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.sendImagesService.create(file);
  }

  @Post('archive')
  @UseInterceptors(FileInterceptor('file'))
  archive(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.sendImagesService.sendArchives(file, req);
  }
}
