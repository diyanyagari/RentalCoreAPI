// src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Role } from "./entity/Role";
import "dotenv/config";
import { CategoryProduct } from "./entity/CategoryProduct";
import { Transactions } from "./entity/Transactions";
import { Product } from "./entity/Product";
import { join } from "path";
import { readdirSync } from "fs";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Synchronize in development only
  logging: true,
  entities: [User, Role, CategoryProduct, Product, Transactions], // Add entities here
  subscribers: [],
  migrations: ["src/migration/**/*.ts"],
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
