import express from "express";
import BookingSchema from "../models/BookingSchema.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create booking
router.post("/", auth, async (req, res) => {
    try {
        const { vehicleId, startDate, endDate, extras } = req.body;
        const booking = new BookingSchema({
            user: req.user.id,
            vehicle: vehicleId,
            startDate,
            endDate,
            extras,
            totalAmount: req.body.totalAmount,
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get user's bookings
router.get("/my-bookings", auth, async (req, res) => {
    try {
        const bookings = await BookingSchema.find({ user: req.user.id })
            .populate("vehicle")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
