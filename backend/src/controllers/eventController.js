import { Event } from "../models/Event.js";
import { RSVP } from "../models/RSVP.js";
import { Feedback } from "../models/Feedback.js";

export async function createEvent(req, res) {
    try {
        const event = await Event.create({ ...req.body, hostId: req.user.id });
        res.status(201).json(event);
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getEvents(req, res) {
    try {
        const events = await Event.find().populate('hostId', 'name email');
        res.json(events);
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getEvent(req, res) {
    try {
        const event = await Event.findById(req.params.id).populate('hostId', 'name email');
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        console.error("Get event error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateEvent(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        if (event.hostId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        
        Object.assign(event, req.body);
        await event.save();
        res.json(event);
    } catch (error) {
        console.error("Update event error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function rsvpEvent(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        const now = new Date();
        if (now > event.rsvpDeadline) {
            return res.status(400).json({ message: "RSVP deadline passed" });
        }
        
        const existing = await RSVP.findOne({
            eventId: event._id, 
            userId: req.user.id 
        });
        if (existing) {
            return res.status(400).json({ message: "Already RSVPed" });
        }
        
        await RSVP.create({
            eventId: event._id,
            userId: req.user.id
        });

        console.log(`Email: You're confirmed for ${event.title}`);
        res.json({ status: "RSVP'd" });
    } catch (error) {
        console.error("RSVP error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function checkInEvent(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        const now = new Date();
        if (now < event.dateTime) {
            return res.status(400).json({ message: "Check-in not open" });
        }
        
        let rsvp = await RSVP.findOne({
            eventId: event._id,
            userId: req.user.id
        });
        
        if (!rsvp) {
            rsvp = await RSVP.create({
                eventId: event._id,
                userId: req.user.id,
                status: "Walk-in"
            });
        }

        rsvp.status = "Checked-in";
        await rsvp.save();
        
        console.log(`Email: Check-in confirmed for ${event.title}`);
        res.json({ status: "Checked-in" });
    } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function eventAnalytics(req, res) {
    try {
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

        const keywords = {};
        feedbacks.forEach(fb => {
            if (fb.comment) {
                fb.comment.split(/\s+/).forEach(word => {
                    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                    if (cleanWord.length > 3) {
                        keywords[cleanWord] = (keywords[cleanWord] || 0) + 1;
                    }
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
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ message: "Server error" });
    }
