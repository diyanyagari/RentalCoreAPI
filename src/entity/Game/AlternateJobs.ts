import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class AlternateJobs {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  jobname!: string;
}