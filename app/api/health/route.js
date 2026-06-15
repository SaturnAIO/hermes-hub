export async function GET() {
  try {
    const res = await fetch(`${process.env.HERMES_API_URL}/health`, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return Response.json({ ok: true, ...data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
