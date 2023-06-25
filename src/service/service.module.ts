import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, PrismaService, JwtService],
})
export class ServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/service', method: RequestMethod.POST },
        { path: '/service/:id', method: RequestMethod.GET },
        { path: '/service/:id', method: RequestMethod.PATCH },
        { path: '/service/:id', method: RequestMethod.DELETE },
      );
  }
}
