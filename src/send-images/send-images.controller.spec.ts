import { Test, TestingModule } from '@nestjs/testing';
import { SendImagesController } from './send-images.controller';
import { SendImagesService } from './send-images.service';
import { UploaderService } from 'src/singleServices/uploader.service';

describe('SendImagesController', () => {
  let controller: SendImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendImagesController],
      providers: [SendImagesService, UploaderService],
    }).compile();

    controller = module.get<SendImagesController>(SendImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
