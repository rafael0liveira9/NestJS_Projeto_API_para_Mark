import { ApiProperty } from '@nestjs/swagger';

class Images {
  @ApiProperty()
  name: string;
  @ApiProperty()
  imageId: number;
}

export class CreateSiteDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  images: Images[];
}
