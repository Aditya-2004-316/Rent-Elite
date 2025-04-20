import express from "express";
import Stripe from "stripe";
import auth from "../middleware/auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Process payment
router.post("/", auth, async (req, res) => {
    try {
        const { amount, paymentMethodId, bookingId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: true,
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            status: paymentIntent.status,
        });
    } catch (error) {
        res.status(500).json({ message: "Payment failed" });
    }
});

export default router;
