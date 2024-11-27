import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CategoryProduct } from "./CategoryProduct";
import { Product } from "./Product";
import { User } from "./User";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string; // Reference to the user who made the transaction

  @Column({ type: "uuid" })
  productId!: string; // Reference to the rented product

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  rentalStartDate!: Date; // Start date of the rental

  @Column({ type: "timestamp", nullable: true })
  rentalEndDate!: Date; // Expected end date of the rental

  @Column({ type: "timestamp", nullable: true })
  actualReturnDate!: Date; // Actual return date (if returned)

  @Column({ type: "decimal", precision: 10, scale: 2 })
  dailyRentalRate!: number; // Cost to rent the product per day

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalRentalPrice!: number; // Total cost for the rental

  @Column({
    type: "enum",
    enum: ["pending", "ongoing", "completed", "cancelled"],
  })
  status!: "pending" | "ongoing" | "completed" | "cancelled"; // Rental status

  @Column({ type: "enum", enum: ["unpaid", "paid", "partially_paid"] })
  paymentStatus!: "unpaid" | "paid" | "partially_paid"; // Payment status

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  securityDeposit!: number; // Security deposit amount

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  lateFee!: number; // Late fee for overdue returns

  @Column({ type: "text", nullable: true })
  notes!: string; // Additional notes for the transaction

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User; // Relation to the User entity

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product!: Product; // Relation to the Product entity

  @ManyToOne(() => CategoryProduct)
  @JoinColumn({ name: "categoryId" })
  category!: CategoryProduct; // Relation to the CategoryProduct entity
}
