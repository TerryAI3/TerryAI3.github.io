import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getAllProducts, getProductById, getProductsByCategory, getAllCategories, createProduct, updateProduct, deleteProduct } from "./db";
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
        categoryId: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        specifications: z.string().optional(),
        price: z.string(),
        imageUrl: z.string().optional(),
        images: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Only admins can create products');
        await createProduct({
          categoryId: input.categoryId,
          name: input.name,
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

  categories: router({
    list: publicProcedure.query(async () => {
      return await getAllCategories();
    }),
  }),
});

export type AppRouter = typeof appRouter;
