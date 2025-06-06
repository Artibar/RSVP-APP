
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { updateFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.put("/:id", authenticate, updateFeedback);

export default router;
