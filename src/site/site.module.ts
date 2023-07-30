import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';

@Module({
  controllers: [SiteController],
  providers: [SiteService, PrismaService, JwtService],
})
export class SiteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/site/to-layout', method: RequestMethod.POST },
        { path: '/site/to-plan', method: RequestMethod.POST },
        { path: '/site/publish-layout', method: RequestMethod.PUT },
        { path: '/site/to-layout-finished', method: RequestMethod.PUT },
      )
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/site/to-show', method: RequestMethod.PUT },
        { path: '/site/save-show', method: RequestMethod.PUT },
        { path: '/site/approve-layout', method: RequestMethod.PUT },
      );
  }
}
