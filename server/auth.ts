import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

import passport from "passport";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";
import { logAdminActivity } from "./adminMiddleware";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  });
}

async function upsertUser(
  claims: any,
  authProvider: string = "google"
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"] || claims["given_name"],
    lastName: claims["last_name"] || claims["family_name"],
    profileImageUrl: claims["profile_image_url"] || claims["picture"],
    authProvider,
    emailVerified: false, // Require verification for all users
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/callback/google",
          passReqToCallback: true,
        },
        async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value;

            // Check if user already exists by email
            const existingUser = await storage.getUserByEmail(email);
            let userId: string;

            if (!existingUser) {
              // New user - create with Google ID
              userId = googleId;
              const verificationToken = randomUUID();

              const createdUser = await storage.upsertUser({
                id: userId,
                email: email,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                profileImageUrl: profile.photos?.[0]?.value,
                authProvider: "google",
                emailVerified: false,
                verificationToken: verificationToken,
              });
            } else {
              // Existing user - use their database ID
              userId = existingUser.id;

              // Update user profile and login stats
              await storage.updateUser(userId, {
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                profileImageUrl: profile.photos?.[0]?.value,
                authProvider: "google",
              });

              await storage.updateLoginStats(userId);
            }

            const user = {
              claims: {
                sub: userId,
                email: email,
                given_name: profile.name?.givenName,
                family_name: profile.name?.familyName,
                picture: profile.photos?.[0]?.value,
              },
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
            };

            done(null, user);
          } catch (error) {
            console.error("Error in Google OAuth strategy:", error);
            done(error, null);
          }
        }
      )
    );
  }

  // Local Strategy for Regular User Login
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await storage.getUserByEmail(email);

          if (!user || !user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Prevent admin accounts from logging in via regular login
          if (user.isAdmin) {
            return done(null, false, { message: "Please use admin login" });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Update login statistics
          await storage.updateLoginStats(user.id);

          const sessionUser = {
            claims: {
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
            },
            expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
          };

          done(null, sessionUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Local Strategy for Admin Login
  passport.use(
    "admin-local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await storage.getUserByEmail(email);

          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.isAdmin) {
            return done(null, false, { message: "Access denied" });
          }

          if (!user.password) {
            return done(null, false, { message: "Invalid authentication method" });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Update login statistics
          await storage.updateLoginStats(user.id);

          const sessionUser = {
            claims: {
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              isAdmin: user.isAdmin,
              adminRole: user.adminRole,
              adminName: user.adminName,
            },
            expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
          };

          done(null, sessionUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  // Local Strategy for Owner Login
  passport.use(
    "owner-local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await storage.getUserByEmail(email);

          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.isOwner) {
            return done(null, false, { message: "Owner access denied" });
          }

          if (!user.password) {
            return done(null, false, { message: "Invalid authentication method" });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Update login statistics
          await storage.updateLoginStats(user.id);

          const sessionUser = {
            claims: {
              sub: user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              isOwner: user.isOwner,
              ownerName: user.ownerName,
            },
            expires_at: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 1 week
          };

          done(null, sessionUser);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Google OAuth Routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get(
      "/api/login/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );

    app.get(
      "/api/callback/google",
      passport.authenticate("google", {
        failureRedirect: "/login",
      }),
      async (req, res) => {
        try {
          // Get user ID from the passport user object
          const userId = (req.user as any)?.claims?.sub;
          
          if (userId) {
            // Fetch fresh user data from database
            const freshUserData = await storage.getUser(userId);
            
            // Update session user with fresh data if found
            if (freshUserData) {
              (req.user as any) = {
                claims: {
                  sub: freshUserData.id,
                  email: freshUserData.email,
                  given_name: freshUserData.firstName,
                  family_name: freshUserData.lastName,
                  picture: freshUserData.profileImageUrl,
                },
                access_token: (req.user as any)?.access_token,
                refresh_token: (req.user as any)?.refresh_token,
                expires_at: (req.user as any)?.expires_at,
              };
            }
          }

          // Explicitly establish the session by calling req.login()
          req.login(req.user!, (err) => {
            if (err) {
              console.error("Failed to establish session after Google OAuth:", err);
              return res.redirect("/login?error=session_failed");
            }

            // Explicitly save the session before redirecting to ensure it persists
            req.session.save((saveErr) => {
              if (saveErr) {
                console.error("Failed to save session after Google OAuth:", saveErr);
                return res.redirect("/login?error=session_save_failed");
              }

              // Session established and saved successfully, redirect to home
              res.redirect("/");
            });
          });
        } catch (error) {
          console.error("Error in Google OAuth callback:", error);
          res.redirect("/login?error=callback_error");
        }
      }
    );
  }

  // User Registration Route
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      console.log("[Auth] Registration request for:", email);

      // Validate input
      if (!email || !password || !firstName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength (at least 8 characters)
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Check if user exists in Neon DB
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate email verification token
      const verificationToken = randomUUID();

      // Create user in Neon DB
      const userId = randomUUID();
      const createdUser = await storage.upsertUser({
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: "local",
        isAdmin: false,
        emailVerified: true,
        verificationToken: null,
      });

      console.log("[Auth] User registered successfully:", userId);

      // Return success
      res.json({
        success: true,
        message: "Account created successfully! You can now log in.",
      });
    } catch (error) {
      console.error("[Auth] Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // User Login Route (Email/Password)
  app.post("/api/login/local", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed" });
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Admin Local Login Routes
  app.post("/api/login/admin", (req, res, next) => {
    passport.authenticate("admin-local", async (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed" });
        }

        // Log admin login activity
        await logAdminActivity(
          user.claims.sub,
          user.claims.email,
          user.claims.adminName || `${user.claims.first_name} ${user.claims.last_name}`,
          "admin_login",
          undefined,
          undefined,
          { role: user.claims.adminRole },
          req
        );

        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Owner Local Login Route
  app.post("/api/login/owner", (req, res, next) => {
    passport.authenticate("owner-local", async (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, async (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed" });
        }

        // Log owner login activity
        await logAdminActivity(
          user.claims.sub,
          user.claims.email,
          user.claims.ownerName || `${user.claims.first_name} ${user.claims.last_name}`,
          "owner_login",
          undefined,
          undefined,
          { role: "owner" },
          req
        );

        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Logout
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // Email Verification Route
  // Email Verification - DISABLED
  app.get("/api/verify-email/:token", async (req, res) => {
    res.status(403).json({ success: false, message: "Email verification is no longer required." });
  });

  // Request Password Reset
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ success: true, message: "If an account exists, a reset link has been sent" });
      }

      // Generate reset token (valid for 1 hour)
      const resetToken = randomUUID();
      res.json({ success: false, message: "Password reset is currently disabled. Please contact support." });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "Failed to process reset request" });
    }
  });

  // Reset Password with Token - DISABLED
  app.post("/api/reset-password/:token", async (req, res) => {
    res.status(403).json({ success: false, message: "Password reset is currently disabled. Please contact support." });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userId = user.claims.sub;
    const dbUser = await storage.getUser(userId);

    // Allow both admins and owners
    if (!dbUser?.isAdmin && !dbUser?.isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
