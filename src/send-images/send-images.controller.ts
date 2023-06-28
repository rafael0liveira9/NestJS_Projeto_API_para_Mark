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
} from '@nestjs/common';
import { SendImagesService } from './send-images.service';
import { CreateSendImageDto } from './dto/create-send-image.dto';
import { UpdateSendImageDto } from './dto/update-send-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('send-images')
export class SendImagesController {
  constructor(private readonly sendImagesService: SendImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.sendImagesService.create(file);
  }
}
