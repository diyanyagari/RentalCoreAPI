import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CategoryProduct } from "../entity/CategoryProduct";
import { CustomError, GlobalMsg } from "../utils/CustomError";
import { Transactions } from "../entity/Transactions";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

const transactionsRepository = AppDataSource.getRepository(Transactions);
const productRepository = AppDataSource.getRepository(Product);
const userRepository = AppDataSource.getRepository(User);

export const getTransactionsProducts = async (_: Request, res: Response) => {
  try {
    const transactions = await transactionsRepository.find();
    res.status(200).json({
      success: true,
      data: transactions || [],
      message: GlobalMsg("Transactions", transactions),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const getTransactionsByUser = async (_: Request, res: Response) => {
  try {
    const { userId } = _.params;
    // Check if `userId` is provided
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
      return;
    }

    // Fetch transactions for the specified user
    const userTransactions = await transactionsRepository.find({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      data: userTransactions || [],
      message: `Transactions for user ${userId} retrieved successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      productId,
      rentalStartDate,
      rentalEndDate,
      actualReturnDate,
      dailyRentalRate,
      totalRentalPrice,
      status,
      paymentStatus,
      securityDeposit,
      lateFee,
      notes,
    } = req.body;

    if (!userId || !productId || !rentalStartDate || !rentalEndDate) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    // Check if user exists
    const existingUser = await userRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      res.status(400).json({
        success: false,
        message: "User does not exist.",
      });
      return;
    }

    // Check if product exists
    const existingProduct = await productRepository.findOne({
      where: { id: productId },
    });
    if (!existingProduct) {
      res.status(400).json({
        success: false,
        message: "Product does not exist.",
      });
      return;
    }

    const rentalDays = Math.ceil(
      (new Date(rentalEndDate).getTime() -
        new Date(rentalStartDate).getTime()) /
        (1000 * 3600 * 24)
    );

    const calcTotalRentalPrice = dailyRentalRate * rentalDays;

    // Create the new transaction
    const newTransaction = transactionsRepository.create({
      userId,
      productId,
      rentalStartDate,
      rentalEndDate,
      actualReturnDate,
      dailyRentalRate,
      totalRentalPrice: calcTotalRentalPrice,
      status,
      paymentStatus,
      securityDeposit,
      lateFee,
      notes,
      // Optionally, calculate `totalRentalPrice` if not provided (e.g., `dailyRentalRate * rentalDays`)
    });

    await transactionsRepository.save(newTransaction);

    res.status(201).json({ success: true, data: newTransaction });
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
