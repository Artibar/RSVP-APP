
import { Feedback } from "../models/Feedback.js";

// Pin or flag feedback (host only)
export async function updateFeedback(req, res) {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        return res.status(404).json({ message: "Not found" })
    }
    if (req.body.pinned !== undefined) feedback.pinned = req.body.pinned;
    if (req.body.flagged !== undefined) feedback.flagged = req.body.flagged;
    await feedback.save();
    res.json(feedback);
}
