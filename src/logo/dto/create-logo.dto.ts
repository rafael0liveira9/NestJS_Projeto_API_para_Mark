import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateLogoDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  proof: number;
  @ApiProperty()
  reasonRefuse: string;
  @ApiProperty()
  isApproved: boolean;
  @ApiProperty()
  mockups: number[];
}

export class SendArchivesDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  archives: ArchivesModel[];
}

class ArchivesModel {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  previewImage: number;
}

export class SendFeedbackDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  comments: string;
  @ApiProperty()
  stars: number;
}
