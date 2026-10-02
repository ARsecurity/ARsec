require("dotenv").config();

const { pool } = require("./database");

async function checkDatabase() {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("\nARSec database tables:\n");

    for (const row of result.rows) {
      console.log(`✓ ${row.table_name}`);
    }

    console.log(`\nTotal tables: ${result.rows.length}`);
  } catch (error) {
    console.error("Database check failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkDatabase();
