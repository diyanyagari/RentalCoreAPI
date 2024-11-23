import { MinLength } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Unique,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column({ unique: true }) // This ensures that the 'username' is unique
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @MinLength(6)
  password!: string;

  @Column({ default: "customer" })
  role!: "admin" | "business owner" | "customer";

  @Column({ type: "timestamp", nullable: true })
  last_login!: Date | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  // Hook to set the timestamps and is_active before insert
  @BeforeInsert()
  setDefaultValuesBeforeInsert() {
    const now = new Date(); // Get the current time in ISO format
    this.created_at = now;
    this.updated_at = now;
    this.last_login = now; // Set the last login time to now
  }

  // Optionally, you can use this hook for updates to set the updated_at field
  @BeforeUpdate()
  updateTimestamps() {
    this.updated_at = new Date();
  }
}
