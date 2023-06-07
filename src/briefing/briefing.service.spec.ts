import { Test, TestingModule } from '@nestjs/testing';
import { BriefingService } from './briefing.service';

describe('BriefingService', () => {
  let service: BriefingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BriefingService],
    }).compile();

    service = module.get<BriefingService>(BriefingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
