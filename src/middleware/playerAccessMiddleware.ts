import { NextFunction, Request, Response } from "express";

interface User {
  userId: string;
  access: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: User;
}

const playerAccessMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log(req.user?.access);
  if (req.user && req.user.access === "player") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access forbidden: Player only." });
  }
};

export default playerAccessMiddleware;
