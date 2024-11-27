import { Router } from "express";
import {
  createCategoryProduct,
  getCategoryProducts,
} from "../controllers/categoryProductController";
import { createProduct, getProducts } from "../controllers/productController";

const router = Router();

router.get("/products", getProducts);
router.post("/products", createProduct);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
