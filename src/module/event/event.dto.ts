import { AutoMap } from "@automapper/classes"
import { IsNotEmpty, IsString, MaxLength, IsDateString } from "class-validator";
import { OmitType } from "@nestjs/mapped-types"

export class EventDto {
  id: number;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @MaxLength(10)
  @IsDateString({strict: true})
  startDate: string;

  @IsNotEmpty()
  @MaxLength(10)
  @IsDateString({strict: true})
  endDate: string;
}

export class CreateEventDto extends OmitType(EventDto, ["id"]) {}