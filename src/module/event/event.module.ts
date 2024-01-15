import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "@src/database/database.module";
import { Event } from "@src/database/entity/event.entity";
import { EventProfile } from "@src/module/event/event.profiler";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";

import { EventController } from "./event.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Event]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    Logger,
    EventProfile,
  ],
  controllers: [EventController],
})
export class EventModule {}
