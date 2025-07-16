import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "@node-rs/argon2";
import { generateId } from "lucia";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../server";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const passwordHash = await hash(input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const userId = generateId(15);

      const user = await ctx.db.user.create({
        data: {
          id: userId,
          email: input.email,
          passwordHash,
          name: input.name,
          credits: 0,
        },
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return { user: { id: user.id, email: user.email, name: user.name } };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid credentials",
        });
      }

      const validPassword = await verify(user.passwordHash, input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return { user: { id: user.id, email: user.email, name: user.name } };
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await lucia.invalidateSession(ctx.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return { success: true };
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          credits: true,
        },
      });

      return user;
    }),
});