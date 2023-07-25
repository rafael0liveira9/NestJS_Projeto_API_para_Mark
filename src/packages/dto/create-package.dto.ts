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

export class PackagesSearch {
  @ApiProperty()
  value: number;
  @ApiProperty()
  haveLogo: boolean;
  @ApiProperty()
  haveSite: boolean;
  @ApiProperty()
  haveSocialMidia: boolean;
}
