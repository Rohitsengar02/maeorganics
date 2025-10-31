import { NextRequest, NextResponse } from 'next/server';

async function fetchWithTiming(url: string) {
  const started = Date.now();
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const ms = Date.now() - started;
    let bodySnippet = '';
    try {
      const text = await res.text();
      bodySnippet = text.slice(0, 200);
    } catch {}
    return { url, ok: res.ok, status: res.status, bodySnippet, ms };
  } catch (e: any) {
    const ms = Date.now() - started;
    return { url, ok: false, error: e?.message || 'Request failed', ms };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const baseParam = searchParams.get('base') || '';
  const base = baseParam.replace(/\/$/, '');

  // Build targets similar to client, but via server to avoid CORS
  const candidates = [
    `${base}/health`,
    `${base}/api/health`,
    `${base}/api/ping`,
    `${base}/`,
  ];

  // Filter duplicates and empty
  const targets = Array.from(new Set(candidates.filter(Boolean)));

  const results = await Promise.all(targets.map((u) => fetchWithTiming(u)));
  const overallOk = results.some((r: any) => r.ok);

  return NextResponse.json({ base, overallOk, results });
}
