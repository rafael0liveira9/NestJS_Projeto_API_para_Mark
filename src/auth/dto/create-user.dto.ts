import { ApiProperty } from '@nestjs/swagger';

export class UserDefault {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class CreateUserClient extends UserDefault {
  @ApiProperty()
  name: string;
  @ApiProperty()
  document: string;
  @ApiProperty()
  documentType: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  firebaseToken: string;
}

export class CreateUserAdmin extends CreateUserClient {
  @ApiProperty()
  isAdmin: boolean;
}
