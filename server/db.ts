import "dotenv/config";
import { createPool, Pool } from "mysql2/promise";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

// Support both MYSQL_* and DB_* env var formats (cPanel often uses DB_*)
const host = MYSQL_HOST || DB_HOST || "localhost";
const port = MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : DB_PORT ? parseInt(DB_PORT, 10) : 3306;
const user = MYSQL_USER || DB_USER || "";
const password = MYSQL_PASSWORD || DB_PASSWORD || "";
const database = MYSQL_DATABASE || DB_NAME || "";

const pool: Pool = createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };
