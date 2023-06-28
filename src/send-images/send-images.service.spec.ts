import { Test, TestingModule } from '@nestjs/testing';
import { SendImagesService } from './send-images.service';

describe('SendImagesService', () => {
  let service: SendImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendImagesService],
    }).compile();

    service = module.get<SendImagesService>(SendImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
