import express from "express";
import { claimReward } from "../controllers/rewardController.js";
const router = express.Router();
router.post("/claim", claimReward);
export default router;
