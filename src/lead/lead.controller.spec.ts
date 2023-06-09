import { Test, TestingModule } from '@nestjs/testing';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

describe('LeadController', () => {
  let controller: LeadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadController],
      providers: [LeadService, PrismaService, JwtService],
    }).compile();

    controller = module.get<LeadController>(LeadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
