import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity()
export class CategoryProduct {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
