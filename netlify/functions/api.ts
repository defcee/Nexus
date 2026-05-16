import serverless from "serverless-http";
import { createServer } from "../../server";

// Create single Express instance
const app = createServer();

// Export handler for serverless environments
export const handler = serverless(app);