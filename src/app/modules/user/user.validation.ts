import { z } from 'zod';

export const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user", "agent"]).optional(),
  }),
});

export const loginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
