import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CompanieService } from './companie.service';
import { CompanieController } from './companie.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';
import { JwtService } from 'src/singleServices/jwt.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';

@Module({
  controllers: [CompanieController],
  providers: [CompanieService, PrismaService, JwtService],
})
export class CompanieModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes({ path: '/companie', method: RequestMethod.GET })
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/companie', method: RequestMethod.POST },
        { path: '/companie/me', method: RequestMethod.GET },
        { path: '/companie/change-active', method: RequestMethod.POST },
      );
  }
}
