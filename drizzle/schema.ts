import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** Password hash for email/password login */
  passwordHash: varchar("passwordHash", { length: 255 }),
  /** Password reset token */
  resetToken: varchar("resetToken", { length: 255 }),
  /** Password reset token expiration time */
  resetTokenExpiry: timestamp("resetTokenExpiry"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
/**
 * Product Series Table
 * Stores product series like Dawn, Jerry, Sunshine, etc.
 */
export const productSeries = mysqlTable("product_series", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }),
  code: varchar("code", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  coverImage: varchar("coverImage", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductSeries = typeof productSeries.$inferSelect;
export type InsertProductSeries = typeof productSeries.$inferInsert;

/**
 * Product Category Table
 * Stores product categories like office chairs, meeting tables, etc.
 */
export const productCategories = mysqlTable("product_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  type: mysqlEnum("type", ["office", "school"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

/**
 * Products Table
 * Stores individual products with details, pricing, and images
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  seriesId: int("seriesId").notNull(),
  categoryId: int("categoryId"),
  name: varchar("name", { length: 200 }).notNull(),
  nameEn: varchar("nameEn", { length: 200 }),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  specifications: text("specifications"),
  features: text("features"),
  dimensions: varchar("dimensions", { length: 200 }),
  materials: text("materials"),
  colors: text("colors"),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  images: text("images"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  isFeatured: int("isFeatured").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product Inquiries Table
 * Stores customer inquiries about products
 */
export const productInquiries = mysqlTable("product_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId"),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  company: varchar("company", { length: 200 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "contacted", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductInquiry = typeof productInquiries.$inferSelect;
export type InsertProductInquiry = typeof productInquiries.$inferInsert;

/**
 * Cases Table
 * Stores project cases/examples showcasing products in real environments
 */
export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 200 }),
  completedDate: varchar("completedDate", { length: 50 }),
  mainImage: varchar("mainImage", { length: 500 }),
  images: text("images"),
  products: text("products"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;
