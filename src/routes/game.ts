import { Router } from "express";
import {
  getAlternateJobsByUser,
  createChoosenJobs,
  deleteChoosenJobs,
} from "../controllers/game/chooseJobs";
import {
  createAlternateJobs,
  deleteAlternateJobs,
  getAlternateJobs,
  updateAlternateJobs,
} from "../controllers/game/alternateJobs";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import playerAccessMiddleware from "../middleware/playerAccessMiddleware";

const router = Router();

router.get(
  "/game/chooseAlternate/:userId",
  authMiddleware,
  adminMiddleware,
  getAlternateJobsByUser
);
router.post(
  "/game/chooseAlternate",
  authMiddleware,
  playerAccessMiddleware,
  createChoosenJobs
);

router.delete(
  "/game/chooseAlternate",
  authMiddleware,
  adminMiddleware,
  deleteChoosenJobs
);

// master data alternate jobs
router.get(
  "/game/alternatejobs",
  authMiddleware,
  adminMiddleware,
  getAlternateJobs
);
router.post(
  "/game/alternatejobs",
  authMiddleware,
  adminMiddleware,
  createAlternateJobs
);
router.put(
  "/game/alternatejobs/:id",
  authMiddleware,
  adminMiddleware,
  updateAlternateJobs
);
router.delete(
  "/game/alternatejobs/:id",
  authMiddleware,
  adminMiddleware,
  deleteAlternateJobs
);

export default router;
