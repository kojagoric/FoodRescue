import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const rl = readline.createInterface({ input, output });
const email = (await rl.question("Admin email: ")).trim();
const password = await rl.question("Admin password (minimum 12 characters): ");
rl.close();

if (!email || password.length < 12) {
  console.error("Provide a valid email and a password of at least 12 characters.");
  process.exit(1);
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "foodrescue"
});

try {
  const hash = await bcrypt.hash(password, 12);
  await connection.execute(
    "INSERT INTO USERS (email, password_hash, role) VALUES (?, ?, 'admin')",
    [email, hash]
  );
  console.log("Admin account created. Keep the password private.");
} finally {
  await connection.end();
}
