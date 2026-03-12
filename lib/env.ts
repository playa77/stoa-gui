import { z } from 'zod';

const EnvSchema = z.object({
  STOA_BACKEND_URL: z.string().url().default('http://37.60.240.152:8420'),
});

export const env = EnvSchema.parse({
  STOA_BACKEND_URL: process.env.STOA_BACKEND_URL,
});
