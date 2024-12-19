import { Router } from "express";
import {
  createCategoryProduct,
  getCategoryProducts,
} from "../controllers/categoryProductController";
import { createProduct, getProducts } from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/products", authMiddleware, getProducts);
router.post("/products", authMiddleware, createProduct);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
