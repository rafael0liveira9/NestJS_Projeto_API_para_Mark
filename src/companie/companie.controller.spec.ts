import { Test, TestingModule } from '@nestjs/testing';
import { CompanieController } from './companie.controller';
import { CompanieService } from './companie.service';
import { JwtService } from 'src/singleServices/jwt.service';
import { PrismaService } from 'src/singleServices/prisma.service';

describe('CompanieController', () => {
  let controller: CompanieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanieController],
      providers: [CompanieService, PrismaService, JwtService],
    }).compile();

    controller = module.get<CompanieController>(CompanieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
