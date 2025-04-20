import { exec } from "child_process";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config();

const backupDir = path.join(process.cwd(), "backups");

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Generate a filename with date
const getBackupFilename = () => {
    const date = new Date();
    return `rentelite_backup_${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}.gz`;
};

const backupFilePath = path.join(backupDir, getBackupFilename());

// MongoDB connection string from environment variables
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    console.error("MongoDB URI not found in environment variables.");
    process.exit(1);
}

// Extract DB name from connection string
const dbName = MONGODB_URI.split("/").pop().split("?")[0];

// Build the mongodump command
const cmd = `mongodump --uri="${MONGODB_URI}" --archive="${backupFilePath}" --gzip`;

console.log("Starting database backup...");

// Execute the backup
exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`Backup error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
        return;
    }

    console.log(`Database backup completed successfully: ${backupFilePath}`);
});
