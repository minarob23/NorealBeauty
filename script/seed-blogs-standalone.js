import { config } from "dotenv";
config();

// Now dynamically import the actual seed script
import("./seed-blog-posts.ts");
