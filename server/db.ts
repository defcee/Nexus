import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// ============================================
// ENV VARIABLES
// ============================================

const DATABASE_URL =
  process.env.DATABASE_URL || "";

// ============================================
// ENV VALIDATION
// ============================================

console.log("====================================");
console.log("🐘 Initializing PostgreSQL Connection");
console.log("====================================");

if (!DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is missing in .env"
  );
}

console.log("🌐 Database: Neon PostgreSQL");

console.log("====================================");

// ============================================
// POSTGRES CONNECTION POOL
// ============================================

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ============================================
// DATABASE CONNECTION TEST
// ============================================

export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT NOW() AS now"
    );

    console.log("====================================");

    console.log(
      "✅ PostgreSQL Connected Successfully"
    );

    console.log(
      `🕒 Server Time: ${result.rows[0].now}`
    );

    console.log("====================================");

    client.release();

    return true;
  } catch (error: any) {
    console.error("====================================");

    console.error(
      "❌ PostgreSQL Connection Failed"
    );

    console.error(error);

    console.error("====================================");

    // DO NOT crash entire server
    return false;
  }
}

// ============================================
// AUTO TEST CONNECTION
// ============================================

testDatabaseConnection();