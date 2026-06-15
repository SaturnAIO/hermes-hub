export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${process.env.HERMES_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    const data = await res.json();
    return Response.json({ ok: true, ...data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
