import "dotenv/config";
import { db } from "../db";
import { sql } from "drizzle-orm";

export async function migrateNotifications() {
  console.log("Creating notifications table...");
  
  try {
    // Create notifications table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create index on user_id for faster queries
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    `);

    // Create index on read status for faster queries
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
    `);

    // Create index on created_at for sorting
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
    `);

    console.log("✅ Successfully created notifications table with indexes");
  } catch (error) {
    console.error("Error migrating notifications:", error);
    throw error;
  }
}

// Run migration
migrateNotifications()
  .then(() => {
    console.log("Notifications migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Notifications migration failed:", error);
    process.exit(1);
  });
