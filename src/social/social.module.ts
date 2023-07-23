import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService, JwtService],
})
export class SocialModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/social/to-show', method: RequestMethod.POST },
        { path: '/social/to-approve', method: RequestMethod.POST },
        { path: '/social/to-plan', method: RequestMethod.POST },
        { path: '/social/to-pending-publish', method: RequestMethod.POST },
        { path: '/social/to-publish', method: RequestMethod.POST },
      )
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/social/update-show', method: RequestMethod.PUT },
        { path: '/social/update-approve', method: RequestMethod.PUT },
      );
  }
}
