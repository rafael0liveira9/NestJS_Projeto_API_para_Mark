import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, PrismaService, JwtService, AsaasService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
