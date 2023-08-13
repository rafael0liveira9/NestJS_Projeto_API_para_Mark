import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BriefingService } from './briefing.service';
import {
  CreateBriefingLogoDto,
  CreateBriefingSocialDto,
  CreateBriefingSiteDto,
} from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';

@Controller('briefing')
export class BriefingController {
  constructor(private readonly briefingService: BriefingService) {}

  @Post('social')
  createBriefingSocial(@Body() createBriefingDto: CreateBriefingSocialDto) {
    return this.briefingService.createSocial(createBriefingDto);
  }

  @Post('logo')
  createBriefingLogo(@Body() createBriefingDto: CreateBriefingLogoDto) {
    return this.briefingService.createLogo(createBriefingDto);
  }

  @Post('site')
  createBriefingSite(
    @Body() createBriefingDto: CreateBriefingSiteDto,
    @Req() req,
  ) {
    return this.briefingService.createSite(createBriefingDto, req);
  }
}
