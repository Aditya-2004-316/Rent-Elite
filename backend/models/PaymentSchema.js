import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount cannot be negative"],
        },
        paymentMethod: {
            type: String,
            enum: ["card", "paypal"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        transactionId: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Payment", paymentSchema);
