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
export class AutheticationUserMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  async use(req: RequestAuth, res: Response, next: Function) {
    try {
      const jwtData = await this.jwt.readJwt({
        token: req.headers.authorization,
      });

      console.log(jwtData);

      if (jwtData.roleType <= 3) {
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
