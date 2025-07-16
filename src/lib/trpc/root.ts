import { createTRPCRouter } from "@/lib/trpc/server";
import { userRouter } from "./routers/user";
import { reportRouter } from "./routers/report";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  report: reportRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;