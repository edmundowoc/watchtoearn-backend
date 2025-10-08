// routes/userRoutes.js
import express from "express";
import { createUser, earnPoints } from "../controllers/userController.js";
const router = express.Router();

router.post("/", createUser);
router.post("/:uid/earn", earnPoints);

export default router;
