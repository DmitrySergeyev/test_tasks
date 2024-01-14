import { Column, Entity, Exclusion, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";

@Entity()
@Exclusion(
  "reservation_during_excl",
  `USING GIST (during WITH &&)`,
)
export class Event {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'pk_event_id',
  })
  id: string;

  @Column()
  @AutoMap()
  name: string;

  @Column({ type: 'daterange' })
  during: string;

  @Column({ nullable: true })
  @AutoMap()
  description?: string;
}
