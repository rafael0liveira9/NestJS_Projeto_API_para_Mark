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
  haveLogo: {
    isSelected: boolean;
    needModification: boolean;
  };
  @ApiProperty()
  haveSite: {
    isSelected: boolean;
    needModification: boolean;
  };
  @ApiProperty()
  haveSocialMidia: {
    isSelected: boolean;
    needModification: boolean;
  };
}
