import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { LogoService } from './logo.service';
import {
  CreateLogoDto,
  SendArchivesDto,
  SendFeedbackDto,
} from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';

@Controller('logo')
export class LogoController {
  constructor(private readonly logoService: LogoService) {}

  @Post('to-proof')
  toProof(@Body() createLogoDto: CreateLogoDto, @Req() req) {
    return this.logoService.toProof(createLogoDto, req);
  }

  @Put('send-feedback')
  sendFeedback(@Body() sendFeedback: SendFeedbackDto) {
    return this.logoService.sendFeedback(sendFeedback);
  }

  @Put('send-archives')
  sendArchives(@Body() sendArchives: SendArchivesDto, @Req() req) {
    return this.logoService.addArchives(sendArchives, req);
  }

  @Put('to-proof')
  updateProof(@Body() updateLogo: UpdateLogoDto, @Req() req) {
    return this.logoService.updateProof(updateLogo, req);
  }
}
