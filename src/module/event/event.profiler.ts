import { Injectable } from "@nestjs/common";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  typeConverter,
} from "@automapper/core";
import { EventDto } from "@src/module/event/event.dto";
import { Event } from "@src/database/entity/event.entity";

@Injectable()
export class EventProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap<Event, EventDto>(
        mapper,
        Event,
        EventDto,

        forMember(
          (dest: EventDto) => dest.id,
          mapFrom((s: Event) => Number(s.id)),
        ),

        forMember(
          (dest: EventDto) => dest.startDate,
          mapFrom((s: Event) => s.during.slice(1, 11)),
        ),

        forMember(
          (dest: EventDto) => dest.endDate,
          mapFrom((s: Event) => s.during.slice(12, 22)),
        ),
      )

      createMap<EventDto, Event>(
        mapper,
        EventDto,
        Event,

        typeConverter(String, Number, str => Number(str)),

        forMember(
          (dest: Event) => dest.during,
          mapFrom((s: EventDto) => `[${s.startDate},${s.endDate}]`),
        ),
      )
    }
  }
}