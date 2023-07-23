import { ApiProperty } from '@nestjs/swagger';

export class ChangeCompanieDto {
  @ApiProperty()
  companieId: number;
}
