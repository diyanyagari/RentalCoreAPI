import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { AlternateJobs } from "../../entity/Game/AlternateJobs";
import bcrypt from "bcryptjs";
import { CustomError, GlobalMsg } from "../../utils/CustomError";
import { Equal, Like } from "typeorm";
import { validate as isUuid } from "uuid";

const alternateJobsRepository = AppDataSource.getRepository(AlternateJobs);

export const getAlternateJobs = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await alternateJobsRepository.count({
      where: [
        {
          jobname: Like(`%${searchQuery}%`),
        },
      ],
    });

    const jobs = await alternateJobsRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      where: [
        {
          jobname: Like(`%${searchQuery}%`),
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: jobs || [],
      message: GlobalMsg("Alternate Jobs", jobs),
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

export const createAlternateJobs = async (req: Request, res: Response) => {
  try {
    const { jobname } = req.body;

    if (!jobname) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const existingUser = await alternateJobsRepository.findOne({
      where: [{ jobname }],
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Alternate Jobs Name already exists. Please choose a different one.",
      });
      return;
    }

    const newUser = alternateJobsRepository.create({
      ...req.body,
    });
    await alternateJobsRepository.save(newUser);

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

export const updateAlternateJobs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { jobname } = req.body;

    const user = await alternateJobsRepository.findOne({ where: { id: id } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Alternate Jobs not found.",
      });
      return;
    }

    // Update fields
    user.jobname = jobname || user.jobname;

    // Save updated user
    await alternateJobsRepository.save(user);

    res.status(200).json({
      success: true,
      message: "Alternate Jobs updated successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const deleteAlternateJobs = async (req: Request, res: Response) => {
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
    const user = await alternateJobsRepository.findOne({ where: { id: Equal(id) } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Delete user
    await alternateJobsRepository.remove(user);

    res.status(200).json({
      success: true,
      message: "Alternate Jobs deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
