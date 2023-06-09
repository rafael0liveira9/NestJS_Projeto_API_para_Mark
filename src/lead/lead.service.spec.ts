import { Test, TestingModule } from '@nestjs/testing';
import { LeadService } from './lead.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('LeadService', () => {
  let service: LeadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadService, PrismaService, JwtService],
    }).compile();

    service = module.get<LeadService>(LeadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
