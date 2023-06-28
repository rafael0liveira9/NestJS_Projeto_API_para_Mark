import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty()
  url: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  author: string;
}
