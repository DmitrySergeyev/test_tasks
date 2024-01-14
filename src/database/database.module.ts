import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from "./entity/event.entity";
import { baseOptions } from "./database.config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => (<TypeOrmModuleOptions>{
          ...baseOptions,
          host: configService.get(`DB_HOST`),
          port: Number(configService.get(`DB_PORT`)),
          username: configService.get(`DB_USERNAME`),
          password: configService.get(`DB_PASSWORD`),
          database: configService.get(`DB_NAME`),
          entities: [Event],
        }),
        inject: [ConfigService],
      }),
    ],
})
export class DatabaseModule {}
