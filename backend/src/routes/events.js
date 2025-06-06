
import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  rsvpEvent,
  checkInEvent,
  eventAnalytics,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", authenticate, getEvents);
router.post("/", authenticate, createEvent);
router.get("/:id", authenticate, getEvent);
router.put("/:id", authenticate, updateEvent);
router.post("/:id/rsvp", authenticate, rsvpEvent);
router.post("/:id/checkin", authenticate, checkInEvent);
router.get("/:id/analytics", authenticate, eventAnalytics);

export default router;
