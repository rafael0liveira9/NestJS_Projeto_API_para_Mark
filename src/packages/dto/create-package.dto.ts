import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  dueDate?: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  services: number[];
}
