import { z } from 'zod';

export const SessionSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  status: z.enum(['idle', 'running', 'error', 'terminated']),
  metadata: z.record(z.any()).optional(),
});
export type Session = z.infer<typeof SessionSchema>;

export const MessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'agent', 'system', 'tool']),
  content: z.string(),
  tool_calls: z.array(z.any()).optional(),
  timestamp: z.string().datetime(),
});
export type Message = z.infer<typeof MessageSchema>;

export const CreateSessionRequestSchema = z.object({
  metadata: z.record(z.any()).optional(),
});

export const CapabilityRequestSchema = z.object({
  prompt: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});
