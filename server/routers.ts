import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllProducts, getProductById, getProductsByCategory, getProductsBySeries, getAllCategories, createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory, getCategoryById, getAllSeries, getSeriesById, getSeriesBySlug, createSeries, updateSeries, deleteSeries, getAllCases, getCaseById, getCaseBySlug, getCasesByCategory, createCase, updateCase, deleteCase } from "./db";
import { z } from "zod";
import { storagePut } from "./storage";

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

  upload: router({
    image: protectedProcedure
      .input(z.object({
        filename: z.string(),
        base64: z.string(),
        contentType: z.string().default('image/jpeg'),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can upload images');
        try {
          const buffer = Buffer.from(input.base64, 'base64');
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const ext = input.filename.split('.').pop() || 'jpg';
          const uniqueFilename = `products/${timestamp}-${randomStr}.${ext}`;
          const result = await storagePut(uniqueFilename, buffer, input.contentType);
          return { success: true, url: result.url, key: result.key };
        } catch (error) {
          throw new Error(`Image upload failed: ${(error as Error).message}`);
        }
      }),
  }),

  cases: router({
    list: publicProcedure.query(async () => {
      return await getAllCases();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return await getCaseById(input);
    }),
    getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      return await getCaseBySlug(input);
    }),
    getByCategory: publicProcedure.input(z.string()).query(async ({ input }) => {
      return await getCasesByCategory(input);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        category: z.string(),
        description: z.string().optional(),
        location: z.string().optional(),
        completedDate: z.string().optional(),
        mainImage: z.string().optional(),
        images: z.string().optional(),
        products: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create cases');
        await createCase({ ...input, isActive: 1, sortOrder: 0 });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        mainImage: z.string().optional(),
        images: z.string().optional(),
        products: z.string().optional(),
        location: z.string().optional(),
        completedDate: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can update cases');
        const { id, ...updates } = input;
        await updateCase(id, updates as any);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can delete cases');
        await deleteCase(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
