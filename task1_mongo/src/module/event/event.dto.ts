import { AutoMap } from "@automapper/classes"
import { IsNotEmpty, IsString, MaxLength, IsDateString } from "class-validator";

export class CreateEventDto {
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

export class EventDto extends CreateEventDto {
  id: number;
}
