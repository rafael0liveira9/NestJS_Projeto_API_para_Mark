import { MiddlewareConsumer, Module, Req, RequestMethod } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';
import { JwtService } from 'src/singleServices/jwt.service';

@Module({
  controllers: [LeadController],
  providers: [LeadService, PrismaService, JwtService],
})
export class LeadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/lead', method: RequestMethod.GET },
        { path: '/lead/:id', method: RequestMethod.DELETE },
        { path: '/lead/:id', method: RequestMethod.GET },
      )
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/lead', method: RequestMethod.POST },
        { path: '/lead/:id', method: RequestMethod.PUT },
      );
  }
}
