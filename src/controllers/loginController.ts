import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password, type = "cms" } = req.body; // `identifier` can be email or username

  const userRepository = AppDataSource.getRepository(User);

  if (!identifier || !password) {
    res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
    return;
  }

  try {
    // Find the user by email
    const user = await userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    // Role-based validation based on the login type
    if (type === "cms" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can log in to the CMS.",
      });
    }

    if (type === "website" && user.role !== "player") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only players can log in to the website.",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, access: user.role },
      jwtSecret as string, // Ensure you have JWT_SECRET in your environment variables
      { expiresIn: "1h" }
    );

    // Send the token and user data as response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
