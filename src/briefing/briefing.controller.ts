import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BriefingService } from './briefing.service';
import { CreateBriefingDto } from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';

@Controller('briefing')
export class BriefingController {
  constructor(private readonly briefingService: BriefingService) {}

  @Post('social')
  createBriefingSocial(@Body() createBriefingDto: CreateBriefingDto) {
    return this.briefingService.create(createBriefingDto);
  }

  @Post('logo')
  createBriefingLogo(@Body() createBriefingDto: CreateBriefingDto) {
    return this.briefingService.create(createBriefingDto);
  }

  @Post('site')
  createBriefingSite(@Body() createBriefingDto: CreateBriefingDto) {
    return this.briefingService.create(createBriefingDto);
  }

  @Get()
  findAll() {
    return this.briefingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.briefingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBriefingDto: UpdateBriefingDto,
  ) {
    return this.briefingService.update(+id, updateBriefingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.briefingService.remove(+id);
  }
}
