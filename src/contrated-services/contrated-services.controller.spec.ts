import { Test, TestingModule } from '@nestjs/testing';
import { ContratedServicesController } from './contrated-services.controller';
import { ContratedServicesService } from './contrated-services.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('ContratedServicesController', () => {
  let controller: ContratedServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratedServicesController],
      providers: [ContratedServicesService, PrismaService, JwtService],
    }).compile();

    controller = module.get<ContratedServicesController>(
      ContratedServicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
