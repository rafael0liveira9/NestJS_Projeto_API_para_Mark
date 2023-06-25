import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ContratedServicesService } from './contrated-services.service';
import { ContratedServicesController } from './contrated-services.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';

@Module({
  controllers: [ContratedServicesController],
  providers: [
    ContratedServicesService,
    JwtService,
    PrismaService,
    AsaasService,
  ],
})
export class ContratedServicesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutheticationUserMiddleware)
      .forRoutes({ path: 'contratedServices', method: RequestMethod.GET });
  }
}
