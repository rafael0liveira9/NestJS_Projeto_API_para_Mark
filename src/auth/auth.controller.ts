import { Controller, Post, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import * as bcrypt from 'bcrypt';
import { ClientJToken, ErrorReturn } from 'src/types/types';
import {
  CreateUserAdmin,
  CreateUserClient,
  UserDefault,
} from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUpUser(
    @Body()
    createUserClient: CreateUserClient,
  ): Promise<ClientJToken | ErrorReturn> {
    return this.authService.createUserClient(createUserClient);
  }

  @Post('/admin/signup')
  async signUpAdmin(@Body() createUserAdmin: CreateUserAdmin) {
    return this.authService.createUserEmployee(createUserAdmin);
  }

  @Post('/signin')
  async signIn(
    @Body()
    body: UserDefault,
  ) {
    return this.authService.userLogin(body);
  }
}
