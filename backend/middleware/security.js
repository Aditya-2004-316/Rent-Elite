import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});

// Apply security headers
const securityMiddleware = (app) => {
    // Add security headers
    app.use(helmet());

    // Apply rate limiting to auth routes
    app.use("/api/auth", limiter);

    // Add HSTS for HTTPS enforcement
    app.use(
        helmet.hsts({
            maxAge: 31536000, // 1 year in seconds
            includeSubDomains: true,
            preload: true,
        })
    );

    console.log("Security middleware initialized");
};

export default securityMiddleware;
