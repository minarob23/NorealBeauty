import "dotenv/config";
import { setupApp, log, httpServer } from "./app";
import { setupVite } from "./vite";

(async () => {
  const app = await setupApp();

  // Setup vite in development only
  if (process.env.NODE_ENV !== "production") {
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
