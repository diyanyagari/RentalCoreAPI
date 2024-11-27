import { MinLength } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CategoryProduct } from "./CategoryProduct";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToOne(
    () => CategoryProduct,
    (categoryProduct) => categoryProduct.products
  )
  @JoinColumn({ name: "categoryProductID" })
  category!: CategoryProduct;
}
