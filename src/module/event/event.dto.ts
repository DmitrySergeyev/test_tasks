import { AutoMap } from "@automapper/classes"
import { IsNotEmpty, IsString, MaxLength, IsDateString } from "class-validator";

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
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @MaxLength(10)
  @IsDateString()
  endDate: string;
}