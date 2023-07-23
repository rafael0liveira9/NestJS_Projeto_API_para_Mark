import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '../singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

interface RequestAuth extends Request {
  userId: number;
  id: number;
  roleType: number;
}

@Injectable()
export class AutheticationUserMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async use(req: RequestAuth, res: Response, next: Function) {
    try {
      const jwtData = await this.jwt.readJwt({
        token: req.headers.authorization,
      });

      console.log();

      const userData = await this.prisma.user.findUnique({
        where: {
          id: jwtData.userId,
        },
      });

      if (userData.roleTypeId <= 3) {
        req.userId = userData.id;
        req.id = jwtData.id;
        req.roleType = userData.roleTypeId;
        next();
      } else {
        throw Error('Usuário sem Permissão');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.UNAUTHORIZED,
          Message: error.message ?? 'Usuário sem Permissão',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
