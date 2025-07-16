import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../server";
import { createPhonePeOrder } from "@/lib/phonepe";
import { createStripeCheckout } from "@/lib/stripe";

const CREDIT_PACKAGES = {
  "10": { credits: 10, amount: 3900, label: "10 Searches" }, // ₹39
  "50": { credits: 50, amount: 17900, label: "50 Searches" }, // ₹179
  "200": { credits: 200, amount: 59900, label: "200 Searches" }, // ₹599
} as const;

export const orderRouter = createTRPCRouter({
  createPhonePeOrder: protectedProcedure
    .input(
      z.object({
        package: z.enum(["10", "50", "200"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const packageInfo = CREDIT_PACKAGES[input.package];
      
      const order = await ctx.db.order.create({
        data: {
          userId: ctx.user.id,
          amount: packageInfo.amount,
          searches: packageInfo.credits,
          status: "PENDING",
        },
      });

      const phonePeOrder = await createPhonePeOrder({
        orderId: order.id,
        amount: packageInfo.amount,
        userId: ctx.user.id,
      });

      await ctx.db.order.update({
        where: { id: order.id },
        data: { phonepeTxnId: phonePeOrder.merchantTransactionId },
      });

      return {
        orderId: order.id,
        redirectUrl: phonePeOrder.redirectUrl,
        merchantTransactionId: phonePeOrder.merchantTransactionId,
      };
    }),

  createStripeCheckout: protectedProcedure
    .input(
      z.object({
        package: z.enum(["10", "50", "200"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const packageInfo = CREDIT_PACKAGES[input.package];
      
      const order = await ctx.db.order.create({
        data: {
          userId: ctx.user.id,
          amount: packageInfo.amount,
          searches: packageInfo.credits,
          status: "PENDING",
        },
      });

      const checkoutSession = await createStripeCheckout({
        orderId: order.id,
        amount: packageInfo.amount,
        credits: packageInfo.credits,
        userId: ctx.user.id,
      });

      await ctx.db.order.update({
        where: { id: order.id },
        data: { stripeTxnId: checkoutSession.id },
      });

      return {
        orderId: order.id,
        checkoutUrl: checkoutSession.url,
        sessionId: checkoutSession.id,
      };
    }),

  getOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.user.id,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),

  listOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      const total = await ctx.db.order.count({
        where: { userId: ctx.user.id },
      });

      return {
        orders,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  getCreditPackages: protectedProcedure.query(() => {
    return Object.entries(CREDIT_PACKAGES).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }),
});