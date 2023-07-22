import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/user', method: RequestMethod.GET },
        { path: '/user/update-password', method: RequestMethod.PUT },
      )
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/user/all', method: RequestMethod.GET },
        { path: '/user/:id', method: RequestMethod.GET },
        { path: '/user/:id', method: RequestMethod.PATCH },
        { path: '/user/:id', method: RequestMethod.DELETE },
      );
  }
}
