import "jest-extended"
import { mock, MockProxy } from "jest-mock-extended";
import { EventController } from '@src/module/event/event.controller';
import { Repository } from "typeorm";
import { Event } from "@src/database/entity/event.entity";
import { Mapper } from "@automapper/core";
import { plainToInstance } from "class-transformer";
import { faker } from "@faker-js/faker"
import { CreateEventDto, EventDto } from "@src/module/event/event.dto";
import { BadRequestException } from "@nestjs/common";
import { TypeORMError } from "typeorm/error/TypeORMError";

const event1 = plainToInstance(Event, {
  id: faker.string.numeric({ length: 6, allowLeadingZeros: false })
});

const event2 = plainToInstance(Event, {
  id: faker.string.numeric({ length: 6, allowLeadingZeros: false })
});

const eventDto1 = plainToInstance(EventDto, {
  id: faker.number.int(1e6),
});

const eventDto2 = plainToInstance(EventDto, {
  id: faker.number.int(1e6),
});

describe(EventController.name, () => {
  let service: EventController;
  const eventRepositoryMock: MockProxy<Repository<Event>> = mock<Repository<Event>>()
  const mapperMock: MockProxy<Mapper> = mock<Mapper>()

  beforeAll(() => {
    jest.disableAutomock()
    service = new EventController(
      eventRepositoryMock,
      mapperMock,
    )
  });

  beforeEach(() => {
    jest.resetAllMocks()
  });

  describe('getAll', () => {
    it('should return all events', async () => {
      const events = [ event1, event2 ];
      const eventDtos = [ eventDto1, eventDto2 ];

      eventRepositoryMock.find.mockResolvedValueOnce(events)
      // @ts-ignore
      mapperMock.mapArray.mockReturnValueOnce(eventDtos)

      await expect(service.getAll()).resolves.toStrictEqual(eventDtos);
      expect(mapperMock.mapArray).toHaveBeenCalledExactlyOnceWith(events, Event, EventDto);
    });
  });

  describe('post', () => {
    const createEventDto = plainToInstance(CreateEventDto, {
      name: faker.word.noun()
    })

    it('should create new event', async () => {
      // @ts-ignore
      mapperMock.map.mockReturnValueOnce(event1)
      eventRepositoryMock.save.mockResolvedValueOnce(event2)
      // @ts-ignore
      mapperMock.map.mockReturnValueOnce(eventDto1)

      await expect(service.post(createEventDto)).resolves.toStrictEqual(eventDto1);
      expect(mapperMock.map).toHaveBeenNthCalledWith(1, createEventDto, CreateEventDto, Event);
      expect(eventRepositoryMock.save).toHaveBeenCalledExactlyOnceWith(event1)
      expect(mapperMock.map).toHaveBeenNthCalledWith(2, event2, Event, EventDto);
    });

    it('should throw BadRequestException if dates already occupied', async () => {
      const error = new TypeORMError(`conflicting key value violates exclusion constraint "reservation_during_excl"`);
      eventRepositoryMock.save.mockRejectedValueOnce(error)

      await expect(service.post(createEventDto)).rejects.toThrowWithMessage(BadRequestException, "The selected dates are already occupied");
    });
  });
});
