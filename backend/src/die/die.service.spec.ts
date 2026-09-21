import { Test, TestingModule } from '@nestjs/testing';
import { DiesService } from './die.service';

describe('DieService', () => {
  let service: DiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiesService],
    }).compile();

    service = module.get<DiesService>(DiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
