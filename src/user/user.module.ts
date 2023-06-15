import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutheticationUserMiddleware)
      .forRoutes({ path: '/user', method: RequestMethod.GET });
  }
}
