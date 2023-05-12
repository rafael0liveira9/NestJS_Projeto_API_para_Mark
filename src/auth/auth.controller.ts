import { Controller, Post, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Client, Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { ClientJToken, ErrorReturn } from 'src/types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUpUser(
    @Body()
    body: {
      name: string;
      document: string;
      documentType: string;
      phone: string;
      email: string;
      password: string;
      firebaseToken: string;
    },
  ): Promise<ClientJToken | ErrorReturn> {
    return this.authService.createUserClient(body);
  }

  @Post('/employee/signup')
  async signUpEmployee(
    @Body()
    body: {
      name: string;
      document: string;
      documentType: string;
      phone: string;
      email: string;
      password: string;
      firebaseToken?: string;
      isAdmin: false;
    },
  ) {
    return this.authService.createUserEmployee(body, false);
  }

  @Post('/admin/signup')
  async signUpAdmin(
    @Body()
    body: {
      name: string;
      document: string;
      documentType: string;
      phone: string;
      email: string;
      password: string;
      firebaseToken?: string;
    },
  ) {
    return this.authService.createUserEmployee(body, true);
  }

  @Post('/signin')
  async signIn(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.userLogin(body);
  }
}
