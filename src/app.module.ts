import { Module } from '@nestjs/common';
import { EventModule } from "./module/event/event.module";

@Module({
  imports: [
    EventModule,
  ],
})
export class AppModule {}
