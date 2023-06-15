import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('PackagesController', () => {
  let controller: PackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
      providers: [PackagesService, PrismaService, JwtService],
    }).compile();

    controller = module.get<PackagesController>(PackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
