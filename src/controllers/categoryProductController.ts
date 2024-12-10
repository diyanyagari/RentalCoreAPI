import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CategoryProduct } from "../entity/CategoryProduct";
import { CustomError, GlobalMsg } from "../utils/CustomError";
import { Like } from "typeorm";

const categoryProductRepository = AppDataSource.getRepository(CategoryProduct);

export const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await categoryProductRepository.count({
      where: [
        {
          name: Like(`%${searchQuery}%`),
        },
      ],
    });

    const categoryProducts = await categoryProductRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      where: [
        {
          name: Like(`%${searchQuery}%`),
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: categoryProducts || [],
      message: GlobalMsg("Category Products", categoryProducts),
      offset: offsetNumber,
      totalItems,
      itemsPerPage: itemsPerPageNumber,
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
