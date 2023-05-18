import { Test, TestingModule } from '@nestjs/testing';
import { CompanieController } from './companie.controller';
import { CompanieService } from './companie.service';

describe('CompanieController', () => {
  let controller: CompanieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanieController],
      providers: [CompanieService],
    }).compile();

    controller = module.get<CompanieController>(CompanieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
