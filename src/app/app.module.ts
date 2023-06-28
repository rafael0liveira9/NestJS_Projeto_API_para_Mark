import { JwtService } from './../singleServices/jwt.service';
import { PrismaService } from '../singleServices/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { CompanieModule } from 'src/companie/companie.module';
import { LeadModule } from 'src/lead/lead.module';
import { ServiceModule } from 'src/service/service.module';
import { BriefingModule } from 'src/briefing/briefing.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ContratedServicesModule } from 'src/contrated-services/contrated-services.module';
import { UserModule } from 'src/user/user.module';
import { PackagesModule } from 'src/packages/packages.module';
import { ImagesModule } from 'src/images/images.module';
import { SendImagesModule } from 'src/send-images/send-images.module';

@Module({
  imports: [
    AuthModule,
    CompanieModule,
    LeadModule,
    ServiceModule,
    BriefingModule,
    PaymentModule,
    ContratedServicesModule,
    UserModule,
    PackagesModule,
    ImagesModule,
    SendImagesModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, JwtService, AppService],
})
export class AppModule {}
