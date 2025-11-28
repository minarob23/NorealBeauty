import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { randomUUID } from "crypto";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const role = process.argv[4] || "admin"; // Default to 'admin', can be 'super-admin', 'admin', or 'moderator'
  const adminName = process.argv[5];

  if (!email || !password) {
    console.error("Usage: npm run create-admin <email> <password> [role] [adminName]");
    console.error("Roles: super-admin, admin, moderator (default: admin)");
    console.error("Example: npm run create-admin admin@example.com password123 super-admin \"John Doe\"");
    process.exit(1);
  }

  const validRoles = ["super-admin", "admin", "moderator"];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role: ${role}. Must be one of: ${validRoles.join(", ")}`);
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [admin] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        authProvider: "local",
        isAdmin: true,
        adminRole: role,
        adminName: adminName || `${email.split("@")[0]} (${role})`,
        emailVerified: true, // Admins don't need email verification
      })
      .returning();

    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", admin.email);
    console.log("🆔 ID:", admin.id);
    console.log("👤 Role:", admin.adminRole);
    console.log("📛 Display Name:", admin.adminName);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nYou can now login at http://localhost:5000/admin-login");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
