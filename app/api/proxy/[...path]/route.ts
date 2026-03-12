import { NextRequest } from 'next/server';

import { proxyRequest } from '@/lib/proxy';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathname = params.path.join('/');
  const search = req.nextUrl.search;
  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();

  return proxyRequest(req, `/${pathname}${search}`, {
    method: req.method,
    body,
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
