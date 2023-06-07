import { Module } from '@nestjs/common';
import { BriefingService } from './briefing.service';
import { BriefingController } from './briefing.controller';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

@Module({
  controllers: [BriefingController],
  providers: [BriefingService, JwtService, PrismaService],
})
export class BriefingModule {}
