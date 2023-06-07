import { ApiProperty } from '@nestjs/swagger';

export class CreateBriefingDto {
  @ApiProperty()
  companieId: number;
  @ApiProperty()
  format:
    | 'QUADRADA'
    | 'REDONDA'
    | 'RENTANGULAR_HORIZONTAL'
    | 'RETANGULAR_VERTICAL'
    | 'NONE';
  @ApiProperty()
  cores: JSON;
  @ApiProperty()
  typography: string;
  @ApiProperty()
  especification: 'EMPRESA' | 'PRODUTO' | 'SERVICO';
  @ApiProperty()
  references: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  mockups: string;
}
