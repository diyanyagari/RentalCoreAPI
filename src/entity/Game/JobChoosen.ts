import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class JobChoosen {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  targetUserId!: string;

  @Column({ type: "uuid" })
  JobID!: string;

  @Column()
  JobName!: string;

  @Column({ type: "uuid" })
  whoIsChooseUserID!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
