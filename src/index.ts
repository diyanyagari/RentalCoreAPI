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
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3002", // Local machine
  "http://123.45.67.89:3000", // VPS IP address
  "http://example.com:3000", // VPS domain
];

app.use(
  "/api",
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no origin (e.g., Postman)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
  [
    userRoutes,
    loginRoutes,
    categoryProductRoutes,
    productsRoutes,
    transactionsRoutes,
  ]
);

app.use(errorHandler);

// Start the server after data source initialization
AppDataSource.initialize().then(() => {
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
