import { PartialType } from '@nestjs/swagger';
import {
  CreateBriefingLogoDto,
  CreateBriefingSiteDto,
  CreateBriefingSocialDto,
} from './create-briefing.dto';

export class UpdateBriefingDto extends PartialType(CreateBriefingLogoDto) {}
