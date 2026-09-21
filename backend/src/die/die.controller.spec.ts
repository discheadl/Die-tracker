import { Test, TestingModule } from '@nestjs/testing';
import { DiesController } from './die.controller';
import { DiesService } from './die.service';

describe('DieController', () => {
  let controller: DiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiesController],
      providers: [DiesService],
    }).compile();

    controller = module.get<DiesController>(DiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
