import { Test, TestingModule } from '@nestjs/testing';
import { ContratedServicesService } from './contrated-services.service';

describe('ContratedServicesService', () => {
  let service: ContratedServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratedServicesService],
    }).compile();

    service = module.get<ContratedServicesService>(ContratedServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
