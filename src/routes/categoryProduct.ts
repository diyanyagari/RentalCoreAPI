import { Router } from "express";
import {
  createCategoryProduct,
  getCategoryProducts,
} from "../controllers/categoryProductController";

const router = Router();

router.get("/category-products", getCategoryProducts);
router.post("/category-products", createCategoryProduct);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
