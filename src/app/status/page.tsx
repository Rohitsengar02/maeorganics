"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CheckResult = {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
  bodySnippet?: string;
  ms?: number;
};

const fallbackBase =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://maeorganics-backend.vercel.app"
    : "http://localhost:5000");

export default function StatusPage() {
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [running, setRunning] = useState(false);

  const base = useMemo(() => fallbackBase.replace(/\/$/, ""), []);

  const targets = useMemo(
    () => [
      `${base}/health`,
      `${base}/api/health`,
      `${base}/api/ping`,
      `${base}/`,
    ],
    [base]
  );

  const runChecks = async () => {
    setRunning(true);
    try {
      const api = `/api/status?base=${encodeURIComponent(base)}`;
      const res = await fetch(api, { cache: "no-store" });
      const data = await res.json();
      const out = (data.results || []) as CheckResult[];
      setResults(out);
    } catch (e: any) {
      setResults([
        { url: base, ok: false, error: e?.message || "Proxy failed" },
      ]);
    }
    setRunning(false);
  };

  useEffect(() => {
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overallOk = results?.some((r) => r.ok) ?? false;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Backend Status</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            Checking against: <span className="font-medium">{base}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`text-sm ${overallOk ? "text-green-700" : "text-red-700"}`}>
            Overall: {overallOk ? "Healthy (at least one endpoint responded OK)" : "Unreachable"}
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={runChecks} disabled={running}>
              {running ? "Checking..." : "Recheck"}
            </Button>
          </div>

          <div className="space-y-3 mt-2">
            {(results || []).map((r) => (
              <div key={r.url} className="rounded-md border p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium break-all">{r.url}</div>
                  <div className={`text-xs ${r.ok ? "text-green-700" : "text-red-700"}`}>
                    {r.ok ? `OK (${r.status})` : "FAILED"} {typeof r.ms === "number" ? `• ${r.ms}ms` : ""}
                  </div>
                </div>
                {!r.ok && r.error && (
                  <div className="text-xs text-red-600 mt-1 break-all">{r.error}</div>
                )}
                {r.bodySnippet && (
                  <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                    {r.bodySnippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-xs text-muted-foreground">
        Tip: Set NEXT_PUBLIC_API_URL in your env to point to your backend explicitly.
      </div>
    </div>
  );
}
