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
import { CreateEventDto, EventDto } from "@src/module/event/event.dto";
import { Event } from "@src/database/entity/event.entity";

type bracketType = "(" | ")" | "[" | "]"
const getRangeDate = (
  bracket: bracketType,
  dateStr: string,
): string => {
  if (bracket === '[' || bracket === ']') {
    return dateStr
  }

  const date = new Date(dateStr)
  if (bracket === '(') {
    date.setDate(date.getDate() + 1)
  }

  if (bracket === ')') {
    date.setDate(date.getDate() - 1)
  }

  return date.toISOString().slice(0, 10)
}

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
          mapFrom((s: Event) => getRangeDate(<bracketType>s.during[0], s.during.slice(1, 11))),
        ),

        forMember(
          (dest: EventDto) => dest.endDate,
          mapFrom((s: Event) => getRangeDate(<bracketType>s.during[22], s.during.slice(12, 22))),
        ),
      )

      createMap<CreateEventDto, Event>(
        mapper,
        CreateEventDto,
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