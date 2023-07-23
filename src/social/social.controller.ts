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
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto, UpdateSocialShowDto } from './dto/update-social.dto';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('to-plan')
  updateToPlanning(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.updateStatusToStatus(createSocialDto, 3, 2);
  }

  @Post('to-create')
  updateToCreate(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.updateStatusToStatus(createSocialDto, 7, 6);
  }

  @Post('to-pending-publish')
  updateToPending(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.updateStatusToStatus(createSocialDto, 11, 10);
  }

  @Post('to-publish')
  updateToPublish(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.updateStatusToStatus(createSocialDto, 12, 11);
  }

  @Post('to-show')
  updateStatusShow(@Body() createSocialDto: CreateSocialDto) {
    return this.socialService.updateStatusToShow(createSocialDto);
  }

  @Post('to-approve')
  updateStatusApprove(@Body() updateShow: UpdateSocialShowDto) {
    return this.socialService.updateApprove(updateShow);
  }

  @Put('update-show')
  updateShow(@Body() updateShow: UpdateSocialShowDto, @Req() req) {
    return this.socialService.updateShow(updateShow, req);
  }

  @Put('update-approve')
  updateApprove(@Body() updateShow: UpdateSocialShowDto, @Req() req) {
    return this.socialService.updateApproveFinal(updateShow, req);
  }

  @Get(':id')
  serviceById(@Param('id') id: string) {
    return this.socialService.findById(+id);
  }
}
