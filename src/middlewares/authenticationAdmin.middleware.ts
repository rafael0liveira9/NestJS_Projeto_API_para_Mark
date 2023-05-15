import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '../singleServices/jwt.service';

interface RequestAuth extends Request {
  userId: number;
  id: number;
  roleType: number;
}

@Injectable()
export class AuthenticationAdminMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  async use(req: RequestAuth, res: Response, next: Function) {
    console.log('Request...');
    try {
      const jwtData = await this.jwt.readJwt({
        token: req.headers.authorization,
      });
      if (jwtData.roleType == 1) {
        req.userId = jwtData.userId;
        req.id = jwtData.id;
        req.roleType = jwtData.roleType;
        next();
      } else {
        throw new HttpException(
          {
            Code: HttpStatus.UNAUTHORIZED,
            Message: 'Usuário sem Permissão',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: authenticationAdmin.middleware.ts:33 ~ AuthenticationAdminMiddleware ~ use ~ error:',
        error,
      );
      throw new HttpException(
        {
          Code: HttpStatus.UNAUTHORIZED,
          Message: 'Usuário sem Permissão',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
