import { Request, Response } from "express";
import { validate as isUUID } from "uuid";
import { AppDataSource } from "../data-source";
import { CategoryProduct } from "../entity/CategoryProduct";
import { Product } from "../entity/Product";
import { CustomError, GlobalMsg } from "../utils/CustomError";

const productRepository = AppDataSource.getRepository(Product);
const categoryProductRepository = AppDataSource.getRepository(CategoryProduct);

export const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await productRepository.find({
      relations: ["category"], // Include the 'category' relationship
    });
    res.status(200).json({
      success: true,
      data: products || [],
      message: GlobalMsg("Products", products),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { id, name, categoryProductID, description } = req.body;

    if (!name || !categoryProductID) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    // Validate categoryProductID format
    if (!isUUID(categoryProductID)) {
      res.status(400).json({
        success: false,
        message: "Invalid categoryProductID format.",
      });
      return;
    }

    // Verify that the categoryProductID exists in the CategoryProduct table
    const existingCategoryProduct = await categoryProductRepository.findOne({
      where: { id: categoryProductID },
    });
    console.log("sdaads", existingCategoryProduct);

    if (!existingCategoryProduct) {
      res.status(400).json({
        success: false,
        message: "The specified categoryProductID does not exist.",
      });
      return;
    }

    const newProduct = productRepository.create({
      name,
      category: existingCategoryProduct,
      description,
    });

    await productRepository.save(newProduct);

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(400).json({
        success: false,
        message: "A custom error occurred.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  }
};
