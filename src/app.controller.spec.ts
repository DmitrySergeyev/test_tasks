import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './module/event/event.controller';
import { EventService } from './module/event/event.service';

describe('AppController', () => {
  let appController: EventController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [EventService],
    }).compile();

    appController = app.get<EventController>(EventController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
