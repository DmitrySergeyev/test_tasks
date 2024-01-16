import "jest-extended"
import * as request from "supertest";
import { Response } from "supertest";
import { DeepPartial, Repository } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { EventController } from "@src/module/event/event.controller";
import { AppModule } from "@src/app.module";
import { Event } from '@src/database/entity/event.entity';

import { DbUtils } from "../specs/src/database/db.utils";
import { faker } from "@faker-js/faker";
import { EventDto } from "@src/module/event/event.dto";

const path = "/event";

const name = faker.word.noun();
const description = faker.hacker.phrase();
const startDate = "2000-01-01";
const endDate = "2000-01-02";

const event: DeepPartial<Event> = {
  name,
  during: `[${startDate},${endDate}]`,
  description,
};

const createEventBody: DeepPartial<EventDto> = {
  name,
  description,
  endDate,
  startDate,
};

describe(`${EventController.name} - e2e`, () => {
  let app: INestApplication

  const dbUtils = DbUtils.getInstance()
  let eventRepository: Repository<Event>
  let repos: Repository<any>[]

  beforeAll(async () => {
    eventRepository = await dbUtils.getRepository(Event)
    repos = [eventRepository]
    await dbUtils.cleanAllRepositories(repos)

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  afterEach(async () => {
    await dbUtils.cleanAllRepositories(repos)
  })

  afterAll(async () => {
    await dbUtils.closeConnection()
    await app.close()
  })

  describe("GET /event", () => {
    it("should get events", async () => {
      await eventRepository.save(event)
      const response: Response = await request(app.getHttpServer()).get(path)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toBeArrayOfSize(1)
      expect(response.body[0]).toEqual(expect.objectContaining(createEventBody))
    })
  })

  describe("POST /event", () => {
    it("should create and return event", async () => {
      const response: Response = await request(app.getHttpServer()).post(path).send(createEventBody)

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toStrictEqual(expect.objectContaining(createEventBody))
    })

    it("should return 401 stats code if dates already occupied", async () => {
      const expectedStatusCode = HttpStatus.BAD_REQUEST
      await eventRepository.save(event)
      const response: Response = await request(app.getHttpServer()).post(path).send(createEventBody)

      expect(response.status).toBe(expectedStatusCode)
      expect(response.body).toStrictEqual(expect.objectContaining({
        statusCode: expectedStatusCode,
        message: "The selected dates are already occupied"
      }))
    })
  })
})