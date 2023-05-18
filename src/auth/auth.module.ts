import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../singleServices/prisma.service';
import { AuthenticationAdminMiddleware } from '../middlewares/authenticationAdmin.middleware';
import { JwtService } from '../singleServices/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes({ path: '/auth/admin/signup', method: RequestMethod.POST });
  }
}
