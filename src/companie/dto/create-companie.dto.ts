import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanieDto {
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  document: string;
  @ApiProperty()
  documentType: string;
}
