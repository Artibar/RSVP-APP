import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import feedbackRoutes from "./routes/feedback.js";
import { authenticateSocket } from "./middleware/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/feedback", feedbackRoutes);

// --- Socket.io for live feedback ---
io.use(authenticateSocket);

io.on("connection", (socket) => {
  const { eventId } = socket.handshake.query;
  socket.join(eventId);

  socket.on("feedback", async (data) => {
    // Save feedback to DB
    const { Feedback } = await import("./models/Feedback.js");
    const feedback = await Feedback.create({
      eventId,
      userId: socket.user.id,
      comment: data.comment,
      emoji: data.emoji,
      createdAt: new Date(),
    });
    io.to(eventId).emit("feedback", {
      comment: feedback.comment,
      emoji: feedback.emoji,
      userId: feedback.userId,
      createdAt: feedback.createdAt,
    });
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
