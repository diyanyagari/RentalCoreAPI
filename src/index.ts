// src/index.ts
import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import userRoutes from './routes/user';
import loginRoutes from './routes/login';
import { errorHandler } from './middleware/errorHandler';
import { loginUser } from './controllers/loginController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// User routes
app.use('/api', [userRoutes, loginRoutes]);
// app.use("/api", loginRoutes);

app.use(errorHandler)

// Start the server after data source initialization
AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
