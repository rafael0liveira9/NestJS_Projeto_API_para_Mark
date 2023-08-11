import { Test, TestingModule } from '@nestjs/testing';
import { SendImagesService } from './send-media.service';
import { UploaderService } from 'src/singleServices/uploader.service';
import { PrismaService } from 'src/singleServices/prisma.service';

describe('SendImagesService', () => {
  let service: SendImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendImagesService, UploaderService, PrismaService],
    }).compile();

    service = module.get<SendImagesService>(SendImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
