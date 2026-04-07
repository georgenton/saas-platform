import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../api-platform/src/app/app.controller';
import { AppService } from '../../../api-platform/src/app/app.service';
import { PrismaService } from '@saas-platform/infra-prisma';
import { AppModule } from '../../../api-platform/src/app/app.module';

describe('GET /api', () => {
  let controller: AppController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    controller = moduleFixture.get(AppController);
  });

  it('should return a message', async () => {
    expect(controller).toBeDefined();
    expect(controller.getData()).toEqual({ message: 'Hello API' });
  });
});
