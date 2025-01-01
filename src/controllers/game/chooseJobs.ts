import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../data-source";
import { AlternateJobs } from "../../entity/Game/AlternateJobs";
import { JobChoosen } from "../../entity/Game/JobChoosen";
import { User } from "../../entity/User";
import { CustomError } from "../../utils/CustomError";
import { validate as isUuid } from "uuid";
import { Equal } from "typeorm";

const JobChoosenRepository = AppDataSource.getRepository(JobChoosen);
const AlternateJobsRepository = AppDataSource.getRepository(AlternateJobs);
const userRepository = AppDataSource.getRepository(User);

export const getAlternateJobsByUser = async (_: Request, res: Response) => {
  try {
    const { userId } = _.params;
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
      return;
    }

    // make user that id is player
    const existingUser = await userRepository.findOne({
      where: { id: userId },
    });
    if (existingUser?.role !== "player") {
      res.status(400).json({
        success: false,
        message: "User not a player.",
      });
      return;
    }

    const choosenJobsList = await JobChoosenRepository.find({
      where: { targetUserId: userId },
    });

    res.status(200).json({
      success: true,
      data: choosenJobsList || [],
      message: `Choosen Jobs for user ${userId} retrieved successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createChoosenJobs = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // Verify and decode the token
    let decoded: any;
    try {
      decoded = jwt.verify(token || "", process.env.JWT_SECRET || "");
    } catch (err) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
      return;
    }

    const whoIsChooseUserID = decoded.userId;
    const { targetUserId, jobID } = req.body;

    if (!targetUserId || !jobID) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    // Validate that whoIsChooseUserID is not the same as targetUserId
    if (whoIsChooseUserID === targetUserId) {
        res.status(400).json({
          success: false,
          message: "The user who is choosing cannot be the same as the target user.",
        });
        return;
      }

    // Check if whoIsChooseUserID is a player
    const existingUser = await userRepository.findOne({
      where: { id: whoIsChooseUserID },
    });
    if (existingUser?.role !== "player") {
      res.status(400).json({
        success: false,
        message: "User not a player.",
      });
      return;
    }

    // Check if targetUserId is a player
    const targetUser = await userRepository.findOne({
      where: { id: targetUserId },
    });
    if (!targetUser || targetUser.role !== "player") {
      res.status(400).json({
        success: false,
        message: "The target user is not a player.",
      });
      return;
    }

    // Check if whoIsChooseUserID has already chosen targetUserId
    const existingChoice = await JobChoosenRepository.findOne({
        where: { whoIsChooseUserID, targetUserId },
      });
      if (existingChoice) {
        res.status(400).json({
          success: false,
          message: "You have already chosen this user.",
        });
        return;
      }

    // Check if alternate jobs exists
    const existingAlternateJobs = await AlternateJobsRepository.findOne({
      where: { id: jobID },
    });
    if (!existingAlternateJobs) {
      res.status(400).json({
        success: false,
        message: "Alternate Jobs does not exist.",
      });
      return;
    }

    const { jobname } = existingAlternateJobs;

    // Choosen the Alternate Jobs
    const newChoosenAlternateJobs = JobChoosenRepository.create({
      targetUserId: targetUserId,
      JobID: jobID,
      JobName: jobname,
      whoIsChooseUserID,
    });

    await JobChoosenRepository.save(newChoosenAlternateJobs);

    res.status(201).json({ success: true, data: newChoosenAlternateJobs });
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

export const deleteChoosenJobs = async (req: Request, res: Response) => {
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
      const user = await JobChoosenRepository.findOne({ where: { id: Equal(id) } });
  
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Data not found.",
        });
        return;
      }
  
      // Delete user
      await JobChoosenRepository.remove(user);
  
      res.status(200).json({
        success: true,
        message: "Choosen Jobs deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  };