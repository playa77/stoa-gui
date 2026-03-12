import { NextRequest } from 'next/server';

import { proxyRequest } from '@/lib/proxy';
import { CapabilityRequestSchema } from '@/lib/schemas';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json();
  const payload = CapabilityRequestSchema.parse(json);

  return proxyRequest(req, `/api/v1/sessions/${params.id}/capabilities`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
