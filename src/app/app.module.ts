import { JwtService } from './../singleServices/jwt.service';
import { PrismaService } from '../singleServices/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { CompanieModule } from 'src/companie/companie.module';

@Module({
  imports: [AuthModule, CompanieModule],
  controllers: [AppController],
  providers: [PrismaService, JwtService, AppService],
})
export class AppModule {}
