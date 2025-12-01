import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Middleware to log admin activities
export async function logAdminActivity(
  adminId: string,
  adminEmail: string,
  adminName: string | null,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: any,
  req?: Request
) {
  try {
    await storage.logAdminActivity({
      adminId,
      adminEmail,
      adminName,
      action,
      targetType: targetType || null,
      targetId: targetId || null,
      details: details ? JSON.stringify(details) : null,
      ipAddress: req?.ip || req?.socket.remoteAddress || null,
      userAgent: req?.headers["user-agent"] || null,
    });

    // Update last admin action timestamp
    await storage.updateAdminAction(adminId);
  } catch (error) {
    console.error("Failed to log admin activity:", error);
    // Don't throw - logging failure shouldn't break the app
  }
}

// Middleware to require admin role (or owner)
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as any;
  
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Allow both admins and owners
  if (!user.claims?.isAdmin && !user.claims?.isOwner) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

// Middleware to require super admin role
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as any;
  
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!user.claims?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  if (user.claims?.adminRole !== "super-admin") {
    return res.status(403).json({ message: "Super admin access required" });
  }

  next();
}

// Middleware to require owner role
export function requireOwner(req: Request, res: Response, next: NextFunction) {
  const user = req.user as any;
  
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!user.claims?.isOwner) {
    return res.status(403).json({ message: "Owner access required" });
  }

  next();
}
