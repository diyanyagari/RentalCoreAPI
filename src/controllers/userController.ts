import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import { CustomError, GlobalMsg } from "../utils/CustomError";
import { Equal, Like } from "typeorm";
import { validate as isUuid } from "uuid";

const userRepository = AppDataSource.getRepository(User);

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await userRepository.count({
      where: [
        {
          firstname: Like(`%${searchQuery}%`), // Using Like for partial matches
        },
        {
          lastname: Like(`%${searchQuery}%`),
        },
        {
          username: Like(`%${searchQuery}%`),
        },
        {
          email: Like(`%${searchQuery}%`),
        },
      ],
    });

    const users = await userRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      where: [
        {
          firstname: Like(`%${searchQuery}%`), // Using Like for partial matches
        },
        {
          lastname: Like(`%${searchQuery}%`),
        },
        {
          username: Like(`%${searchQuery}%`),
        },
        {
          email: Like(`%${searchQuery}%`),
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: users || [],
      message: GlobalMsg("Users", users),
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, firstname, lastname, password, role } = req.body;

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

    const user = await userRepository.findOne({ where: { id: id } });

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

    // Validate the UUID format
    if (!isUuid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid UUID format.",
      });
      return;
    }

    // Find user by ID
    const user = await userRepository.findOne({ where: { id: Equal(id) } });

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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
