import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
            validate: {
                validator: function (v) {
                    return v >= new Date();
                },
                message: "Start date cannot be in the past",
            },
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
            validate: {
                validator: function (v) {
                    return v > this.startDate;
                },
                message: "End date must be after start date",
            },
        },
        pickupTime: {
            type: String,
            required: [true, "Pickup time is required"],
        },
        returnTime: {
            type: String,
            required: [true, "Return time is required"],
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Total amount cannot be negative"],
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
        extras: {
            insurance: {
                type: Boolean,
                default: false,
            },
            additionalDriver: {
                type: Boolean,
                default: false,
            },
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("BookingSchema", bookingSchema);
