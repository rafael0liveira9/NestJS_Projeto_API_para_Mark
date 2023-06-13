import { Test, TestingModule } from '@nestjs/testing';
import { ContratedServicesService } from './contrated-services.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('ContratedServicesService', () => {
  let service: ContratedServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratedServicesService, PrismaService, JwtService],
    }).compile();

    service = module.get<ContratedServicesService>(ContratedServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
