import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSocialDto } from './create-social.dto';

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}
export class UpdateSocialShowDto extends PartialType(CreateSocialDto) {
  @ApiProperty()
  serviceId: number;
  @ApiProperty()
  allApproved: boolean;
  @ApiProperty()
  isRefused: boolean;
}
