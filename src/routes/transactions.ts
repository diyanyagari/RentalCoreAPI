import { Router } from "express";
import {
  createTransaction,
  getTransactionsByUser,
  getTransactionsProducts,
} from "../controllers/transactionsController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/transactions", authMiddleware, getTransactionsProducts);
router.get("/transactions/:userId", authMiddleware, getTransactionsByUser);
router.post("/transactions", authMiddleware, createTransaction);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
