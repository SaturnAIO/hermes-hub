export async function GET() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages?limit=20`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ ok: false, error: err }, { status: res.status });
    }

    const messages = await res.json();

    // Parse Hermes-specific format
    const parsed = messages.map((m) => {
      const content = m.content || "";
      // Detect cron/task output format
      const isCron = content.includes("⏰") || content.includes("────");
      const statusMatch = content.match(/Status:\s*(✅|❌|⚠️)\s*(\w+)/);
      const runtimeMatch = content.match(/Runtime:\s*([\d.]+s)/);
      const tokensMatch = content.match(/Tokens:\s*(\d+)/);
      const taskMatch = content.match(/\[Ops:\s*([^\]]+)\]/);

      return {
        id: m.id,
        type: m.embeds?.length > 0 ? "embed" : isCron ? "cron" : "text",
        content,
        embeds: m.embeds || [],
        status: statusMatch?.[1] === "✅" ? "ok" : statusMatch?.[1] === "❌" ? "error" : "unknown",
        runtime: runtimeMatch?.[1] || null,
        tokens: tokensMatch ? parseInt(tokensMatch[1]) : null,
        task: taskMatch?.[1] || null,
        ts: new Date(m.timestamp).getTime(),
        author: m.author?.username || "hermes",
      };
    });

    return Response.json({ ok: true, messages: parsed });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}

// POST: Send command to Hermes via Discord (optional)
export async function POST(req) {
  try {
    const { content } = await req.json();
    const res = await fetch(
      `https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );
    const data = await res.json();
    return Response.json({ ok: res.ok, data });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 503 });
  }
}
