import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, productCategories, productSeries, InsertProduct, InsertProductSeries } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.isActive, 1));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(
    eq(products.categoryId, categoryId)
  );
}

export async function getProductsBySeries(seriesId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(
    eq(products.seriesId, seriesId)
  );
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productCategories);
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(products).values(product);
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(updates).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// Category queries
export async function createCategory(data: { name: string; slug: string; description?: string; type: 'office' | 'school' }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productCategories).values(data);
  return result;
}

export async function updateCategory(id: number, updates: Partial<{ name: string; description: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(productCategories).set(updates).where(eq(productCategories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productCategories).where(eq(productCategories.id, id));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productCategories).where(eq(productCategories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Product Series queries
export async function getAllSeries() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productSeries).where(eq(productSeries.isActive, 1));
}

export async function getSeriesById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productSeries).where(eq(productSeries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSeriesBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productSeries).where(eq(productSeries.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSeries(data: InsertProductSeries) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productSeries).values(data);
}

export async function updateSeries(id: number, updates: Partial<InsertProductSeries>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(productSeries).set(updates).where(eq(productSeries.id, id));
}

export async function deleteSeries(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productSeries).where(eq(productSeries.id, id));
}
