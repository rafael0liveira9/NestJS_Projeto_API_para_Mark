import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, JwtService, PrismaService],
})
export class PackagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/package', method: RequestMethod.POST },
        { path: '/package/:id', method: RequestMethod.PATCH },
        { path: '/package/:id', method: RequestMethod.GET },
        { path: '/package/:id', method: RequestMethod.DELETE },
      );
  }
}
