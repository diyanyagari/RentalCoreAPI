import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError"; // You can set a custom name for your error class
  }
}

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    // res.json(users);
    res.status(200).json({
      success: true,
      data: users || [], // Returns empty array if no users found
      message: users.length ? "Users retrieved successfully" : "No users found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, firstname, lastname, password } = req.body;

    if (!username || !email || !firstname || !lastname || !password) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Account already exists. Please choose a different one.",
      });
      return;
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      ...req.body,
      password: hashedPassword,
    });
    await userRepository.save(newUser);

    res.status(201).json({ success: true, data: newUser });
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, firstname, lastname, password, role } = req.body;

    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Update fields
    user.username = username || user.username;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.password = password || user.password;
    user.role = role || user.role;

    // Save updated user
    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Delete user
    await userRepository.remove(user);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
