
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    description: String,
    dateTime: Date,
    timezone: String,
    location: String,
    rsvpDeadline: Date,
    maxAttendees: Number,
    status: {
        type: String,
        enum: ["Scheduled", "Live", "Closed"],
        default: "Scheduled"
    },
});

export const Event = mongoose.model("Event", eventSchema);
