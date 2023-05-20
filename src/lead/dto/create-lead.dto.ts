import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  subscribeAt?: Date;
}
