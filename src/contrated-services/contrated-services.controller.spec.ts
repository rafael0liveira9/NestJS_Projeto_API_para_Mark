import { Test, TestingModule } from '@nestjs/testing';
import { ContratedServicesController } from './contrated-services.controller';
import { ContratedServicesService } from './contrated-services.service';

describe('ContratedServicesController', () => {
  let controller: ContratedServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratedServicesController],
      providers: [ContratedServicesService],
    }).compile();

    controller = module.get<ContratedServicesController>(
      ContratedServicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
