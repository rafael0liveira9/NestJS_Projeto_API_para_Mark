import { Test, TestingModule } from '@nestjs/testing';
import { BriefingController } from './briefing.controller';
import { BriefingService } from './briefing.service';

describe('BriefingController', () => {
  let controller: BriefingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BriefingController],
      providers: [BriefingService],
    }).compile();

    controller = module.get<BriefingController>(BriefingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
