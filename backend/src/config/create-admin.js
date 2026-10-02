require("dotenv").config();

const bcrypt = require("bcrypt");
const { pool } = require("./database");

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Abdurrahman Rilwanu";

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be provided."
    );
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error(
      "ADMIN_PASSWORD must contain at least 12 characters."
    );
    process.exitCode = 1;
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, LOWER($2), $3, 'admin')
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         role = 'admin',
         updated_at = NOW()
       RETURNING id, name, email, role`,
      [name, email, passwordHash]
    );

    console.log("✓ Admin account ready");
    console.log(`Email: ${result.rows[0].email}`);
    console.log(`Role: ${result.rows[0].role}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdmin();
