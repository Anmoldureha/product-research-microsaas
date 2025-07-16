import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../server";
import { researchQueue } from "@/lib/queue";

export const reportRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        product: z.string().min(1, "Product name is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has credits
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        select: { credits: true },
      });

      if (!user || user.credits < 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient credits",
        });
      }

      // Deduct credit
      await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: { credits: { decrement: 1 } },
      });

      // Create report entry
      const report = await ctx.db.report.create({
        data: {
          userId: ctx.user.id,
          product: input.product,
          jsonData: {}, // Will be populated by worker
        },
      });

      // Add to research queue
      await researchQueue.add("research-product", {
        reportId: report.id,
        product: input.product,
        userId: ctx.user.id,
      });

      return { reportId: report.id };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const report = await ctx.db.report.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!report) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Report not found",
        });
      }

      return report;
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const reports = await ctx.db.report.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
        select: {
          id: true,
          product: true,
          createdAt: true,
          jsonData: true,
        },
      });

      const total = await ctx.db.report.count({
        where: { userId: ctx.user.id },
      });

      return {
        reports,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.db.report.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!report) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Report not found",
        });
      }

      await ctx.db.report.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});