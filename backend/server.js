import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authentication.js";
import vehicleRoutes from "./routes/BackendVehicles.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import User from "./models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { productionTransporter, emailConfig } from "./config/emailConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import securityMiddleware from "./middleware/security.js";

// Load env vars
dotenv.config();

// Validate required env vars
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required");
    process.exit(1);
}

const app = express();

// Middleware
app.use(
    cors({
        origin: ["https://rentelite.netlify.app", "http://localhost:5173"],
        credentials: true,
    })
);
app.use(express.json());

// Connect to database
console.log("Attempting to connect to MongoDB...");
try {
    await connectDB();
    console.log("Database connection successful");
} catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
}

// Create email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "renteliteservice.noreply@gmail.com",
        pass: "npbd qelt iagp dqst", // Replace with the new App Password you generated
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role || "customer" },
            "your-secret-key",
            { expiresIn: "24h" }
        );

        // Send response
        res.json({
            success: true,
            token,
            role: user.role || "customer", // Include role at the top level
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role || "customer", // Include role in the user object too
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// Add this registration endpoint to your existing server.js
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Registration successful",
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// Add this verification function
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log("Email configuration is valid");
        return true;
    } catch (error) {
        console.error("Email configuration error:", error);
        return false;
    }
};

// Update your forgot password route
app.post("/api/auth/forgot-password", async (req, res) => {
    console.log("Forgot password request received:", req.body);

    try {
        // Verify email configuration first
        const isEmailConfigValid = await verifyEmailConfig();
        if (!isEmailConfigValid) {
            throw new Error("Email configuration is invalid");
        }

        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        console.log("Reset token generated");

        // Update user with reset token
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    resetPasswordToken: resetToken,
                    resetPasswordExpiry: Date.now() + 3600000,
                },
            }
        );
        console.log("Token saved to user");

        // Create reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            from: {
                name: "Rent Elite",
                address: "renteliteservice.noreply@gmail.com",
            },
            to: email,
            subject: "Reset Your Rent Elite Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #059669;">Reset Your Rent Elite account Password</h2>
                    <p>Hello valued customer,</p>
                    <p>We received a request to reset your Rent Elite account password. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                           Reset Password
                        </a>
                    </div>
                    <p>This link will expire in 1 hour for security reasons.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p>Best regards,<br>The Rent Elite Team</p>
                </div>
            `,
        };

        // Send email with better error handling
        console.log("Attempting to send email...");
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

        res.json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({
            success: false,
            message: "Error processing password reset request",
            error: error.message,
        });
    }
});

// Modify your reset-password endpoint
app.post("/api/auth/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    console.log("Received reset password request");

    try {
        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            console.log("Invalid or expired reset token");
            return res.status(400).json({
                success: false,
                message: "Password reset token is invalid or has expired",
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update with hashed password
        await User.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: {
                    resetPasswordToken: 1,
                    resetPasswordExpiry: 1,
                },
            }
        );

        console.log("Password reset successful for user:", user.email);

        res.json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Error resetting password",
        });
    }
});

// Add this verification endpoint to test email configuration
app.get("/api/auth/verify-email-config", async (req, res) => {
    try {
        await transporter.verify();
        res.json({ success: true, message: "Email configuration is valid" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Email configuration is invalid",
            error: error.message,
        });
    }
});

// Direct password update endpoint - add this to server.js
app.post("/api/auth/update-password", async (req, res) => {
    try {
        console.log("Server: Password update request received");
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            console.log("Server: Missing required fields");
            return res.status(400).json({
                success: false,
                message:
                    "Email, current password, and new password are required",
            });
        }

        console.log("Server: Looking for user with email:", email);

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Server: User not found");
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("Server: User found, verifying password");

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            console.log("Server: Current password is incorrect");
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        console.log("Server: Password verified, updating to new password");

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // IMPORTANT: Use updateOne to bypass validation instead of save()
        // This way we only update the password field without validating other fields
        await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
        );

        console.log("Server: Password updated successfully");

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Server: Password update error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during password update",
            error: error.message,
        });
    }
});

// Test endpoint to check user model and database
app.get("/api/auth/test-user-model", async (req, res) => {
    try {
        // Count users
        const count = await User.countDocuments();

        res.json({
            success: true,
            message: "User model is working correctly",
            userCount: count,
            modelDefinition: Object.keys(User.schema.paths),
        });
    } catch (error) {
        console.error("User model test error:", error);
        res.status(500).json({
            success: false,
            message: "Error testing user model",
            error: error.message,
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on("error", (error) => {
    console.error("Server failed to start:", error);
});

// After your existing code, add this section for production mode
if (process.env.NODE_ENV === "production") {
    // Serve static files from the React app
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const frontendBuildPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendBuildPath));

    // For any request not handled by API routes, serve the React app
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
    });

    console.log("Running in production mode");

    // Add this after your other middleware
    securityMiddleware(app);
}

// Update CORS settings for production
app.use(
    cors({
        origin: ["https://rentelite.netlify.app", "http://localhost:5173"],
        credentials: true,
    })
);

