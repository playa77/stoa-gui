import { NextRequest } from 'next/server';

import { proxyRequest } from '@/lib/proxy';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(req, `/api/v1/sessions/${params.id}`, { method: 'GET' });
}
