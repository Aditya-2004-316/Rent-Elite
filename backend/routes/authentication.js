import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserSchema from "../models/UserSchema.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const router = express.Router();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "renteliteservice.noreply@gmail.com", // Replace with your Gmail
        pass: "ssag jkpn tkkv kzqn", // Replace with your app password
    },
});

// Register user
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, phone, role } = req.body;

        // Check if user exists
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user (role defaults to "customer" if not specified)
        const user = new UserSchema({
            email,
            password: hashedPassword,
            name,
            phone,
            role: role || "customer", // This will use the default "customer" from schema if role is not provided
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Include role in token
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            token,
            userId: user._id,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login user (using MongoDB)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in MongoDB
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role || "customer" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Ensure we have a role value to send
        const userRole = user.role || "customer";

        res.json({
            success: true,
            token,
            userId: user._id,
            role: userRole,
            user: {
                id: user._id,
                email: user.email,
                name: user.name || "",
                role: userRole,
                phone: user.phone || "",
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address",
            });
        }

        // Generate reset token (secure, random)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store token in user document with expiry (1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${
            process.env.FRONTEND_URL || "http://localhost:5173"
        }/reset-password/${resetToken}`;

        // Send email with reset link
        try {
            // Configure email service (nodemailer)
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Define email content
            const mailOptions = {
                from: process.env.EMAIL_FROM || "noreply@rentelite.com",
                to: email,
                subject: "Password Reset Request",
                html: `
                    <h1>Password Reset</h1>
                    <p>You requested a password reset for your RentElite account.</p>
                    <p>Click the link below to set a new password:</p>
                    <a href="${resetUrl}" style="padding:10px 20px;background:#059669;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            };

            // Send the email
            await transporter.sendMail(mailOptions);

            res.status(200).json({
                success: true,
                message: "Password reset email sent successfully",
            });
        } catch (emailError) {
            // Remove token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiry = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: "Error sending password reset email",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during password reset request",
        });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user in MongoDB
        let user = await UserSchema.findOne({ email });

        if (!user) {
            // Fallback to file-based users if not found in MongoDB
            try {
                let users = JSON.parse(fs.readFileSync("users.json", "utf8"));
                const userIndex = users.findIndex((u) => u.email === email);

                if (userIndex === -1) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                }

                // Hash the new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Update user's password in the file
                users[userIndex].password = hashedPassword;
                users[userIndex].salt = salt;

                // Save updated users array to file
                fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
            } catch (fileError) {
                return res.status(404).json({
                    success: false,
                    message: "User not found in any data store",
                });
            }
        } else {
            // User found in MongoDB, update there
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during password reset",
        });
    }
});

router.post("/update-password", async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // Find user in MongoDB
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password (optional security step)
        if (currentPassword) {
            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect",
                });
            }
        }

        // Hash and update new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password in MongoDB
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Password update error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during password update",
        });
    }
});

router.post("/delete-account", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in MongoDB
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify password for security
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        // Delete user from MongoDB
        await UserSchema.deleteOne({ _id: user._id });

        // You may want to delete related data like bookings, etc.
        // Add additional deletion logic here if needed

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Account deletion error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during account deletion",
        });
    }
});

export default router;
