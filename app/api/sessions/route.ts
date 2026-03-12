import { NextRequest } from 'next/server';

import { proxyRequest } from '@/lib/proxy';
import { CreateSessionRequestSchema } from '@/lib/schemas';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/api/v1/sessions', { method: 'GET' });
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const payload = CreateSessionRequestSchema.parse(json);

  return proxyRequest(req, '/api/v1/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
