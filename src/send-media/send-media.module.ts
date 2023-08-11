import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SendImagesService } from './send-media.service';
import { SendImagesController } from './send-media.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { UploaderService } from 'src/singleServices/uploader.service';
import { AuthenticationAdminMiddleware } from 'src/middlewares/authenticationAdmin.middleware';
import { AutheticationUserMiddleware } from 'src/middlewares/authenticationUser.middleware';

@Module({
  controllers: [SendImagesController],
  providers: [SendImagesService, JwtService, PrismaService, UploaderService],
})
export class SendMediaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutheticationUserMiddleware)
      .forRoutes(
        { path: '/send-media', method: RequestMethod.POST },
        { path: '/send-media/archive', method: RequestMethod.POST },
      );
  }
}
