import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "./adminMiddleware";

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Ensure you have a `JWT_SECRET` in your environment variables
    req.user = decoded as typeof req.user; // Attach the decoded user to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
    return;
  }
};

export default authMiddleware;
