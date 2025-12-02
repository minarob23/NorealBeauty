import "dotenv/config";
import { app, setupApp } from "./app";

// Initialize app once
let initialized = false;

// Export handler for Vercel serverless
export default async function handler(req: any, res: any) {
  if (!initialized) {
    await setupApp();
    initialized = true;
  }
  
  // Use the Express app to handle the request
  return app(req, res);
}
