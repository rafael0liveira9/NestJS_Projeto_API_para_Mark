import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  serviceTypeId: number;
  @ApiProperty()
  model: {
    name: string;
    id: string;
  };
  @ApiProperty()
  modelId: number;
}
