import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ default: "customer" })
  role!: "admin" | "business owner" | "customer";
}
