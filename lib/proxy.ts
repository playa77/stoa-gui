import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

const REQUEST_TIMEOUT_MS = 15_000;

export async function proxyRequest(
  req: NextRequest,
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const targetUrl = `${env.STOA_BACKEND_URL}${path}`;
    const response = await fetch(targetUrl, {
      method: init.method ?? req.method,
      body: init.body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const payload = await response.text();

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: 'service_unavailable',
        message: 'Stoa backend is unavailable',
      },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
