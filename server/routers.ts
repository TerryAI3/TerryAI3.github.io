import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllProducts, getProductById, getProductsByCategory, getProductsBySeries, getAllCategories, createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory, getCategoryById, getAllSeries, getSeriesById, getSeriesBySlug, createSeries, updateSeries, deleteSeries } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getProductById(input);
    }),
    getByCategory: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getProductsByCategory(input);
    }),
    create: protectedProcedure
      .input(z.object({
        seriesId: z.number(),
        categoryId: z.number().optional(),
        name: z.string(),
        nameEn: z.string().optional(),
        slug: z.string(),
        description: z.string().optional(),
        specifications: z.string().optional(),
        price: z.string().optional(),
        imageUrl: z.string().optional(),
        images: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create products');
        await createProduct({
          seriesId: input.seriesId,
          categoryId: input.categoryId,
          name: input.name,
          nameEn: input.nameEn,
          slug: input.slug,
          description: input.description,
          specifications: input.specifications,
          price: input.price as any,
          imageUrl: input.imageUrl,
          images: input.images,
          isActive: 1,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update products');
        const { id, ...updates } = input;
        await updateProduct(id, updates as any);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can delete products');
        await deleteProduct(input);
        return { success: true };
      }),
  }),

  series: router({
    list: publicProcedure.query(async () => {
      return await getAllSeries();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getSeriesById(input);
    }),
    getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      return await getSeriesBySlug(input);
    }),
    getProducts: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getProductsBySeries(input);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        nameEn: z.string().optional(),
        code: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create series');
        await createSeries(input);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update series');
        const { id, ...updates } = input;
        await updateSeries(id, updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can delete series');
        await deleteSeries(input);
        return { success: true };
      }),
  }),

  categories: router({
    list: publicProcedure.query(async () => {
      return await getAllCategories();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getCategoryById(input);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        type: z.enum(['office', 'school']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create categories');
        await createCategory(input);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update categories');
        const { id, ...updates } = input;
        await updateCategory(id, updates);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can delete categories');
        await deleteCategory(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
