import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';
import { AsanaService } from 'src/singleServices/asana.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    JwtService,
    PrismaService,
    AsaasService,
    AsanaService,
  ],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationAdminMiddleware)
      .forRoutes(
        { path: '/payment/all', method: RequestMethod.GET },
        { path: '/payment/:uuid', method: RequestMethod.GET },
      )
      .apply(AutheticationUserMiddleware)
      .forRoutes({ path: '/payment/checkout', method: RequestMethod.POST });
  }
}
