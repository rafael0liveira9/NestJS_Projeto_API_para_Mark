import { Test, TestingModule } from '@nestjs/testing';
import { LogoService } from './logo.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('LogoService', () => {
  let service: LogoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoService, PrismaService, JwtService],
    }).compile();

    service = module.get<LogoService>(LogoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
