import { Test, TestingModule } from '@nestjs/testing';
import { SendImagesController } from './send-media.controller';
import { SendImagesService } from './send-media.service';
import { UploaderService } from 'src/singleServices/uploader.service';
import { PrismaService } from 'src/singleServices/prisma.service';

describe('SendImagesController', () => {
  let controller: SendImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendImagesController],
      providers: [SendImagesService, UploaderService, PrismaService],
    }).compile();

    controller = module.get<SendImagesController>(SendImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
