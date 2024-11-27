// src/index.ts
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user";
import loginRoutes from "./routes/login";
import categoryProductRoutes from "./routes/categoryProduct";
import transactionsRoutes from "./routes/transactions";
import productsRoutes from "./routes/product";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// User routes
app.use("/api", [
  userRoutes,
  loginRoutes,
  categoryProductRoutes,
  productsRoutes,
  transactionsRoutes,
]);
// app.use("/api", loginRoutes);

app.use(errorHandler);

// Start the server after data source initialization
AppDataSource.initialize().then(() => {
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
