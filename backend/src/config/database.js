const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ...(isProduction && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

const testDatabaseConnection = async () => {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("✓ PostgreSQL connection successful");
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  testDatabaseConnection,
};
