import { Test, TestingModule } from '@nestjs/testing';
import { BriefingController } from './briefing.controller';
import { BriefingService } from './briefing.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsanaService } from 'src/singleServices/asana.service';

describe('BriefingController', () => {
  let controller: BriefingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BriefingController],
      providers: [BriefingService, PrismaService, JwtService, AsanaService],
    }).compile();

    controller = module.get<BriefingController>(BriefingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
