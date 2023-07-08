import { ApiProperty } from '@nestjs/swagger';

export class SelectLayoutDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  imageId: number;
  @ApiProperty()
  isApproved: boolean;
  @ApiProperty()
  refuseReason: string;
}
