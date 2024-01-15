import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const baseOptions: PostgresConnectionOptions = {
  type: 'postgres',
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  logNotifications: true,
  extra: {
    charset: 'utf8mb4',
  },
}

export const DataSourceConfig = new DataSource({
  ...baseOptions,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['./src/database/entity/**/*{.js,.ts}'],
  migrations: ['./src/database/migration/**/*{.js,.ts}'],
})
