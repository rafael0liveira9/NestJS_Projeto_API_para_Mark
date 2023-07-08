import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

@Module({
  controllers: [SiteController],
  providers: [SiteService, PrismaService, JwtService],
})
export class SiteModule {}
