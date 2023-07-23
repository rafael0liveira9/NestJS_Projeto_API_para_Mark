import { Test, TestingModule } from '@nestjs/testing';
import { BriefingService } from './briefing.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsanaService } from 'src/singleServices/asana.service';

describe('BriefingService', () => {
  let service: BriefingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BriefingService, PrismaService, JwtService, AsanaService],
    }).compile();

    service = module.get<BriefingService>(BriefingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
