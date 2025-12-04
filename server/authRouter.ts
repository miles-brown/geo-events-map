import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import { signup, login } from './auth';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  signup: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await signup(input);
        return { success: true, user: result.user, token: result.token };
      } catch (error: any) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
      }
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await login(input);
        return { success: true, user: result.user, token: result.token };
      } catch (error: any) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: error.message });
      }
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (ctx.user) {
      return {
        id: ctx.user.id,
        email: ctx.user.email || '',
        name: ctx.user.name || '',
        role: ctx.user.role,
      };
    }
    return null;
  }),
});
