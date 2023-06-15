import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('PackagesService', () => {
  let service: PackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackagesService, PrismaService, JwtService],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
