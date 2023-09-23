import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '../singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

interface RequestAuth extends Request {
  userId: number;
  id: number;
  roleType: number;
}

@Injectable()
export class AuthenticationAdminMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async use(req: RequestAuth, res: Response, next: NextFunction) {
    try {
      const jwtData = await this.jwt.readJwt({
        token: req.headers.authorization,
      });

      const userData = await this.prisma.user.findUnique({
        where: {
          id: jwtData.userId,
        },
      });

      await this.prisma.$disconnect();

      if (userData.roleTypeId == 3) {
        req.userId = userData.id;
        req.id = jwtData.id;
        req.roleType = userData.roleTypeId;
        next();
      } else {
        throw Error('Usuário sem Permissão');
      }
    } catch (error) {
      await this.prisma.$disconnect();
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
