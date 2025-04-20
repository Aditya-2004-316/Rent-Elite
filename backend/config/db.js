import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is not defined in environment variables"
            );
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Add index creation for production performance
        await createProductionIndexes();

        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Create indexes for better query performance in production
const createProductionIndexes = async () => {
    try {
        // Create indexes for commonly queried fields
        const { default: UserSchema } = await import("../models/UserSchema.js");
        await UserSchema.collection.createIndex({ email: 1 }, { unique: true });

        const { default: VehicleSchema } = await import(
            "../models/VehicleSchema.js"
        );
        await VehicleSchema.collection.createIndex({ type: 1 });
        await VehicleSchema.collection.createIndex({
            "specifications.fuel": 1,
        });

        const { default: BookingSchema } = await import(
            "../models/BookingSchema.js"
        );
        await BookingSchema.collection.createIndex({ user: 1 });
        await BookingSchema.collection.createIndex({ vehicle: 1 });
        await BookingSchema.collection.createIndex({
            startDate: 1,
            endDate: 1,
        });

        console.log("Production indexes created successfully");
    } catch (error) {
        console.error("Error creating production indexes:", error);
    }
};

export default connectDB;
