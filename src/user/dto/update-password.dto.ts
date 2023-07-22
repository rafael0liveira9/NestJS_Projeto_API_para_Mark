import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  oldPassword: string;
  @ApiProperty()
  newPassword: string;
}
