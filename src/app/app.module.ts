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
import { SendMediaModule } from 'src/send-media/send-media.module';
import { SocialModule } from 'src/social/social.module';
import { SiteModule } from 'src/site/site.module';
import { LogoModule } from 'src/logo/logo.module';

@Module({
  imports: [
    AuthModule,
    CompanieModule,
    LeadModule,
    BriefingModule,
    PaymentModule,
    ContratedServicesModule,
    UserModule,
    PackagesModule,
    ImagesModule,
    SendMediaModule,
    ServiceModule,
    SocialModule,
    SiteModule,
    LogoModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, JwtService, AppService],
})
export class AppModule {}
