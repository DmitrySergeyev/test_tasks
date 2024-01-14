import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { Repository } from 'typeorm';
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from '@src/database/entity/event.entity';
import { EventDto } from "@src/module/event/event.dto";

@Controller("event")
export class EventController {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  async getAll(): Promise<any[]> {
    const events = await this.eventRepository.find();
    return this.mapper.mapArray(events, Event, EventDto)
  }

  @Post()
  async post(
    @Param("id") id: number,
    @Body() eventDto: Omit<EventDto, "id">
  ): Promise<EventDto> {
    const event = this.mapper.map(eventDto, EventDto, Event)
    const savedEvent = await this.eventRepository.save(event)
    return this.mapper.map(savedEvent, Event, EventDto)
  }
}
