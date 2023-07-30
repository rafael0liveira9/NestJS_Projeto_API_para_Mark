import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SelectLayoutDto } from './dto/select-layout.dto';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post('to-layout')
  toLayoutPost(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.toLayout(createSiteDto);
  }

  @Post('to-plan')
  toPlanPost(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.toPlan(createSiteDto);
  }

  @Put('to-show')
  toShow(@Body() selectLayout: SelectLayoutDto, @Req() req) {
    return this.siteService.toShow(selectLayout, req);
  }

  @Put('save-show')
  saveShow(@Body() selectLayout: SelectLayoutDto, @Req() req) {
    return this.siteService.saveShow(selectLayout, req);
  }

  @Put('to-layout-finished')
  toLayoutFinished(@Body() selectLayout: SelectLayoutDto, @Req() req) {
    return this.siteService.setLayoutFinished(selectLayout, req);
  }

  @Put('approve-layout')
  approveLayout(@Body() selectLayout: SelectLayoutDto, @Req() req) {
    return this.siteService.approveLayout(selectLayout, req);
  }

  @Put('publish-layout')
  publishLayout(@Body() selectLayout: SelectLayoutDto, @Req() req) {
    return this.siteService.published(selectLayout, req);
  }

  @Get(':id')
  siteById(@Param('id') id: string) {
    return this.siteService.findById(+id);
  }
}
