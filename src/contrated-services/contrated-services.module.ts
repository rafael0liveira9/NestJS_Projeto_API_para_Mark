import { Module } from '@nestjs/common';
import { ContratedServicesService } from './contrated-services.service';
import { ContratedServicesController } from './contrated-services.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';

@Module({
  controllers: [ContratedServicesController],
  providers: [
    ContratedServicesService,
    JwtService,
    PrismaService,
    AsaasService,
  ],
})
export class ContratedServicesModule {}
