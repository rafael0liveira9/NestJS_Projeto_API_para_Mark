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
}
