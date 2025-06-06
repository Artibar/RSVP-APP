
import { Event } from "../models/Event.js";
import { RSVP } from "../models/RSVP.js";
import { Feedback } from "../models/Feedback.js";

// Create Event
export async function createEvent(req, res) {
    const event = await Event.create({ ...req.body, hostId: req.user.id });
    res.json(event);
}

// Get all events (for calendar)
export async function getEvents(req, res) {
    const events = await Event.find();
    res.json(events);
}

// Get single event
export async function getEvent(req, res) {
    const event = await Event.findById(req.params.id);
    res.json(event);
}

// Update event (host only)
export async function updateEvent(req, res) {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Not found" })
    }
    if (event.hostId.toString() !== req.user.id){
        return res.status(403).json({ message: "Forbidden" })
    }
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
}


// RSVP
export async function rsvpEvent(req, res) {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" })
    }
    const now = new Date();
    if (now > event.rsvpDeadline) {
        return res.status(400).json({ message: "RSVP deadline passed" })
    }
    const existing = await RSVP.findOne({
        eventId: event._id, 
        userId: req.user.id });
    if (existing) {
        return res.status(400).json({ message: "Already RSVPed" })
    }
    await RSVP.create({
        eventId: event._id,
        userId: req.user.id
    });

    // Mock email
    console.log(`Email: You're confirmed for ${event.title}`);
    res.json({ status: "RSVP'd" });
}

// Check-in
export async function checkInEvent(req, res) {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" })
    }
    const now = new Date();
    if (now < event.dateTime) {
        return res.status(400).json({ message: "Check-in not open" })
    }
    let rsvp = await RSVP.findOne({
        eventId: event._id,
        userId: req.user.id
    });
    if (!rsvp) rsvp = await RSVP.create({
        eventId: event._id,
        userId: req.user.id,
        status: "Walk-in"
    });

    rsvp.status = "Checked-in";
    await rsvp.save();
    // Mock email
    console.log(`Email: Check-in now open for ${event.title}`);
    res.json({ status: "Checked-in" });
}

// Analytics
export async function eventAnalytics(req, res) {
    const eventId = req.params.id;
    const totalRSVPs = await RSVP.countDocuments({ eventId });
    const actualCheckIns = await RSVP.countDocuments({ eventId, status: "Checked-in" });
    const feedbacks = await Feedback.find({ eventId });
    const feedbackVolume = feedbacks.length;
    const emojiCounts = {};
    feedbacks.forEach(fb => {
        if (fb.emoji) emojiCounts[fb.emoji] = (emojiCounts[fb.emoji] || 0) + 1;
    });
    const topEmojis = Object.entries(emojiCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emoji]) => emoji);

    // Simple keyword extraction
    const keywords = {};
    feedbacks.forEach(fb => {
        if (fb.comment) {
            fb.comment.split(/\s+/).forEach(word => {
                if (word.length > 3) keywords[word.toLowerCase()] = (keywords[word.toLowerCase()] || 0) + 1;
            });
        }
    });
    const topKeywords = Object.entries(keywords)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([kw]) => kw);

    res.json({
        totalRSVPs,
        actualCheckIns,
        feedbackVolume,
        topEmojis,
        keywords: topKeywords,
    });
}