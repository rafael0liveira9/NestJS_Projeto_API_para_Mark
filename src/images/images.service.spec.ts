import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { PrismaService } from 'src/singleServices/prisma.service';
import { JwtService } from 'src/singleServices/jwt.service';

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService, PrismaService, JwtService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
