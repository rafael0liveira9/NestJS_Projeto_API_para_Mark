import { ApiProperty } from '@nestjs/swagger';
import { SocialFeedShowType } from '@prisma/client';

export class CreateSocialDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  feed: SocialFeed[];
}

class SocialFeed {
  @ApiProperty()
  id: number;
  @ApiProperty()
  text: string;
  @ApiProperty()
  type: SocialFeedShowType;
  @ApiProperty()
  approved?: boolean;
  @ApiProperty()
  reasonRefuse?: string;
  @ApiProperty()
  image?: number;
  @ApiProperty()
  comments?: string;
}
