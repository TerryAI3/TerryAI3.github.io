import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.js";
import crypto from "crypto";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);
  
  const email = "TerryKang112@gmail.com";
  const password = "kangjunqi3";
  const name = "Terry Admin";

  console.log(`Checking for admin user: ${email}...`);
  
  const existing = await db.select().from(schema.users).where(schema.eq(schema.users.email, email));
  
  if (existing.length === 0) {
    await db.insert(schema.users).values({
      email,
      name,
      passwordHash: hashPassword(password),
      role: "admin",
      lastSignedIn: new Date()
    });
    console.log("Admin user created successfully!");
  } else {
    console.log("Admin user already exists, updating password...");
    await db.update(schema.users)
      .set({ passwordHash: hashPassword(password), role: "admin" })
      .where(schema.eq(schema.users.email, email));
    console.log("Admin user updated successfully!");
  }
  
  process.exit(0);
}

seed().catch(err => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
