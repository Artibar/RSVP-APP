
import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["RSVP", "Checked-in", "Walk-in"], default: "RSVP"
    },
    createdAt: { type: Date, default: Date.now },
});

export const RSVP = mongoose.model("RSVP", rsvpSchema);