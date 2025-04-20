import express from "express";
import Vehicle from "../models/VehicleSchema.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all vehicles
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get vehicle by ID
router.get("/:id", async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
