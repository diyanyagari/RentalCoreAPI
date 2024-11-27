import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CategoryProduct } from "../entity/CategoryProduct";
import { CustomError, GlobalMsg } from "../utils/CustomError";

const categoryProductRepository = AppDataSource.getRepository(CategoryProduct);

export const getCategoryProducts = async (_: Request, res: Response) => {
  try {
    const categoryProducts = await categoryProductRepository.find();
    res.status(200).json({
      success: true,
      data: categoryProducts || [],
      message: GlobalMsg("Category Products", categoryProducts),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createCategoryProduct = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const existingCategoryProduct = await categoryProductRepository.findOne({
      where: [{ name }],
    });
    if (existingCategoryProduct) {
      res.status(400).json({
        success: false,
        message: "Product already exists. Please create a different one.",
      });
      return;
    }

    const newCategoryProduct = categoryProductRepository.create({
      ...req.body,
    });
    await categoryProductRepository.save(newCategoryProduct);

    res.status(201).json({ success: true, data: newCategoryProduct });
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
