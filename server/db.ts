import "dotenv/config";
import { createPool } from "mysql2/promise";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  // It's okay to allow missing env vars in development, but warn
  console.warn("MySQL env vars not fully set. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE in production.");
}

export const pool = createPool({
  host: MYSQL_HOST || "localhost",
  port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
  user: MYSQL_USER || "",
  password: MYSQL_PASSWORD || "",
  database: MYSQL_DATABASE || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
