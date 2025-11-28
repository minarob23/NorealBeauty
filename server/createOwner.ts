import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { randomUUID } from "crypto";

async function createOwner() {
  const email = process.argv[2];
  const password = process.argv[3];
  const ownerName = process.argv[4];

  if (!email || !password) {
    console.error("Usage: npm run create-owner <email> <password> [ownerName]");
    console.error("Example: npm run create-owner owner@example.com SecurePass123 \"Jane Smith\"");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [owner] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email,
        password: hashedPassword,
        firstName: ownerName?.split(" ")[0] || "Owner",
        lastName: ownerName?.split(" ").slice(1).join(" ") || "Account",
        authProvider: "local",
        isOwner: true,
        isAdmin: false, // Owners are not admins
        ownerName: ownerName || email.split("@")[0],
        emailVerified: true, // Auto-verify owners
      })
      .returning();

    console.log("\n✅ Owner account created successfully!");
    console.log("━".repeat(50));
    console.log("📧 Email:", owner.email);
    console.log("👤 Name:", owner.ownerName);
    console.log("🆔 ID:", owner.id);
    console.log("━".repeat(50));
    console.log("\n🔐 Login URL: http://localhost:5000/owner");
    console.log("⚠️  Keep credentials secure - Owner has highest privileges!\n");
    
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Error creating owner account:");
    if (error.code === "23505") {
      console.error("   Email already exists in database");
    } else {
      console.error("  ", error.message);
    }
    process.exit(1);
  }
}

createOwner();
