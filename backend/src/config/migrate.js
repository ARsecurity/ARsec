require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("./database");

async function migrate() {
  const schemaPath = path.join(__dirname, "../../../database/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  try {
    console.log("Connecting to PostgreSQL...");
    
    await pool.query(schema);

    console.log("✓ Database schema created successfully");
  } catch (error) {
    console.error("✗ Database migration failed");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
