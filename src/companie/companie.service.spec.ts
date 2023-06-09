import { Test, TestingModule } from '@nestjs/testing';
import { CompanieService } from './companie.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

describe('CompanieService', () => {
  let service: CompanieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanieService, PrismaService, JwtService],
    }).compile();

    service = module.get<CompanieService>(CompanieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
