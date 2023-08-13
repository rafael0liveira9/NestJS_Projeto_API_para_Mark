import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LogoService } from './logo.service';
import { LogoController } from './logo.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';

@Module({
  controllers: [LogoController],
  providers: [LogoService, JwtService, PrismaService],
})
export class LogoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/logo/to-proof', method: RequestMethod.POST },
        { path: '/logo/to-plan', method: RequestMethod.POST },
        { path: '/logo/to-archives', method: RequestMethod.POST },
      )
      .apply(AutheticationUserMiddleware)
      .forRoutes({ path: '/logo/to-proof', method: RequestMethod.PUT });
  }
}
