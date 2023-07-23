import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BriefingService } from './briefing.service';
import { BriefingController } from './briefing.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';
import { AsanaService } from 'src/singleServices/asana.service';

@Module({
  controllers: [BriefingController],
  providers: [BriefingService, JwtService, PrismaService, AsanaService],
})
export class BriefingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/briefing/social', method: RequestMethod.POST },
        { path: '/briefing/logo', method: RequestMethod.POST },
        { path: '/briefing/site', method: RequestMethod.POST },
      )
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/briefing/', method: RequestMethod.GET },
        { path: '/briefing/:id', method: RequestMethod.PATCH },
        { path: '/briefing/:id', method: RequestMethod.DELETE },
      );
  }
}
