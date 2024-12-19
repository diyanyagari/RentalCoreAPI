import { Router } from "express";
import {
  createCategoryProduct,
  getCategoryProducts,
} from "../controllers/categoryProductController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/category-products", authMiddleware, getCategoryProducts);
router.post("/category-products", authMiddleware, createCategoryProduct);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
