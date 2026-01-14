import { Test, TestingModule } from '@nestjs/testing';
import { SchemabuilderService } from './schemabuilder.service';

describe('SchemabuilderService', () => {
  let service: SchemabuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchemabuilderService],
    }).compile();

    service = module.get<SchemabuilderService>(SchemabuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
