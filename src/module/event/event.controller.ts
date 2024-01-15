import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { Repository, TypeORMError } from "typeorm";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from '@src/database/entity/event.entity';
import { CreateEventDto, EventDto } from "@src/module/event/event.dto";

@Controller("event")
export class EventController {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  async getAll(): Promise<any[]> {
    const events = await this.eventRepository.find();
    return this.mapper.mapArray(events, Event, EventDto)
  }

  @Post()
  async post(@Body() eventDto: CreateEventDto): Promise<EventDto> {
    try {
      const event = this.mapper.map(eventDto, CreateEventDto, Event)
      const savedEvent = await this.eventRepository.save(event)
      return this.mapper.map(savedEvent, Event, EventDto)
    } catch (e) {
      if (
        e instanceof TypeORMError &&
        e.message === `conflicting key value violates exclusion constraint "reservation_during_excl"`
      ) {
        throw new BadRequestException("The selected dates are already occupied");
      }

      throw e
    }
  }
}
