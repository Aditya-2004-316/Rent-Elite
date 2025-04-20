import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Vehicle name is required"],
            trim: true,
        },
        type: {
            type: String,
            required: [true, "Vehicle type is required"],
            enum: ["Sports", "Luxury", "SUV", "Sedan"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
        },
        specifications: {
            year: {
                type: Number,
                required: true,
            },
            transmission: {
                type: String,
                enum: ["Automatic", "Manual"],
                required: true,
            },
            fuel: {
                type: String,
                enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
                required: true,
            },
            seats: {
                type: Number,
                required: true,
            },
        },
        available: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                rating: Number,
                comment: String,
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Vehicle", vehicleSchema);
