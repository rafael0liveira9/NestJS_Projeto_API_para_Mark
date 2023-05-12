import { JwtService } from './../singleServices/jwt.service';
import { PrismaService } from '../singleServices/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [JwtService, PrismaService, AppService],
})
export class AppModule {}
