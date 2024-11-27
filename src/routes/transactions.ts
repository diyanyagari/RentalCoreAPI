import { Router } from "express";
import {
  createTransaction,
  getTransactionsByUser,
  getTransactionsProducts,
} from "../controllers/transactionsController";

const router = Router();

router.get("/transactions", getTransactionsProducts);
router.get("/transactions/:userId", getTransactionsByUser);
router.post("/transactions", createTransaction);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
