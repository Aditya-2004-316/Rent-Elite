import nodemailer from "nodemailer";

// For production, use a transactional email service
const productionTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "renteliteservice.noreply@gmail.com", // Your RentElite Gmail
        pass: "your-16-digit-app-password", // The App Password generated
    },
});

// Example configuration for different email services
const emailConfig = {
    from: "noreply@rentelite.com", // Your application's email address
    supportEmail: "support@rentelite.com",
    templates: {
        passwordReset: (resetUrl, userName) => ({
            subject: "Reset Your RentElite Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #059669;">RentElite Password Reset</h1>
                    <p>Hello${userName ? " " + userName : ""},</p>
                    <p>We received a request to reset your RentElite account password.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #059669; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this reset, please ignore this email or contact support.</p>
                    <hr style="margin: 30px 0; border: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated email from RentElite. Please do not reply to this email.
                    </p>
                </div>
            `,
        }),
    },
};

export { productionTransporter, emailConfig };
