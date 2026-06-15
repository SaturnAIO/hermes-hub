"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── CUTE ROBOT SVG ──────────────────────────────────────────────────────────
function CuteRobot({ x, y, color = "#ffffff", size = 1, action = "idle", tick = 0, label = "" }) {
  const bob = Math.sin(tick * 0.08 + x * 1.2) * 3;
  const sway = Math.sin(tick * 0.06 + y * 0.8) * 1.5;
  const glowColor = {
    idle: "#60a5fa", thinking: "#fbbf24", active: "#34d399",
    error: "#f87171", working: "#a78bfa", delivering: "#fb923c"
  }[action] || "#60a5fa";

  return (
    <g transform={`translate(${x + sway}, ${y + bob})`} style={{ filter: `drop-shadow(0 4px 12px ${glowColor}44)` }}>
      {/* Body */}
      <ellipse cx="0" cy={14 * size} rx={10 * size} ry={13 * size} fill={color} />
      {/* Neck */}
      <rect x={-3 * size} y={2 * size} width={6 * size} height={4 * size} rx={2} fill={color} />
      {/* Head */}
      <circle cx="0" cy={-4 * size} r={13 * size} fill={color} />
      {/* Face visor */}
      <ellipse cx="0" cy={-5 * size} rx={9 * size} ry={7 * size} fill="#0f172a" />
      {/* Eyes */}
      <circle cx={-4 * size} cy={-6 * size} r={3 * size} fill={glowColor} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}>
        {action === "thinking" && <animate attributeName="r" values={`${3*size};${4*size};${3*size}`} dur="0.7s" repeatCount="indefinite" />}
      </circle>
      <circle cx={4 * size} cy={-6 * size} r={3 * size} fill={glowColor} style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}>
        {action === "thinking" && <animate attributeName="r" values={`${3*size};${4*size};${3*size}`} dur="0.7s" repeatCount="indefinite" begin="0.2s" />}
      </circle>
      {/* Eye shine */}
      <circle cx={-3 * size} cy={-7 * size} r={1 * size} fill="white" opacity="0.8" />
      <circle cx={5 * size} cy={-7 * size} r={1 * size} fill="white" opacity="0.8" />
      {/* Smile */}
      {action !== "error" && (
        <path d={`M ${-4*size} ${-1*size} Q 0 ${2*size} ${4*size} ${-1*size}`} fill="none" stroke={glowColor} strokeWidth={1.5*size} strokeLinecap="round" />
      )}
      {/* Antenna */}
      <line x1="0" y1={-17 * size} x2="0" y2={-24 * size} stroke="#cbd5e1" strokeWidth={1.5 * size} />
      <circle cx="0" cy={-26 * size} r={3 * size} fill={glowColor} style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}>
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Arms */}
      <ellipse cx={-14 * size} cy={8 * size} rx={4 * size} ry={7 * size} fill={color} transform={`rotate(${action === "working" ? -20 : -10}, ${-14*size}, ${8*size})`} />
      <ellipse cx={14 * size} cy={8 * size} rx={4 * size} ry={7 * size} fill={color} transform={`rotate(${action === "delivering" ? 20 : 10}, ${14*size}, ${8*size})`} />
      {/* Chest light */}
      <circle cx="0" cy={12 * size} r={3 * size} fill={glowColor} opacity="0.6" style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}>
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Legs */}
      <ellipse cx={-5 * size} cy={27 * size} rx={3.5 * size} ry={5 * size} fill="#cbd5e1" />
      <ellipse cx={5 * size} cy={27 * size} rx={3.5 * size} ry={5 * size} fill="#cbd5e1" />
      {/* Glow base */}
      <ellipse cx="0" cy={32 * size} rx={12 * size} ry={3 * size} fill={glowColor} opacity="0.15" />
      {/* Label */}
      {label && (
        <text x="0" y={-32 * size} textAnchor="middle" fill={glowColor} fontSize={7 * size} fontFamily="monospace" fontWeight="bold">{label}</text>
      )}
    </g>
  );
}

// ─── OFFICE FURNITURE ─────────────────────────────────────────────────────────
function Desk({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-35" y="-8" width="70" height="40" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <rect x="-32" y="-12" width="64" height="8" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
      {/* Monitor */}
      <rect x="-18" y="-36" width="36" height="24" rx="3" fill="#0a0a1a" stroke="#60a5fa" strokeWidth="1" />
      <rect x="-16" y="-34" width="32" height="20" rx="2" fill="#060614" />
      {/* Screen content */}
      <text x="-12" y="-26" fill="#60a5fa" fontSize="4" fontFamily="monospace">hermes@vps</text>
      <text x="-12" y="-20" fill="#34d399" fontSize="3.5" fontFamily="monospace">● RUNNING</text>
      <text x="-12" y="-15" fill="#94a3b8" fontSize="3" fontFamily="monospace">task_id: 0x4f2a</text>
      {/* Monitor stand */}
      <rect x="-3" y="-12" width="6" height="5" fill="#1e293b" />
      <rect x="-8" y="-8" width="16" height="2" rx="1" fill="#334155" />
      {/* Keyboard */}
      <rect x="-15" y="5" width="30" height="10" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={-13+i*5} y="7" width="4" height="3" rx="0.5" fill="#334155" />
      ))}
      {/* Coffee mug */}
      <ellipse cx="22" cy="0" rx="5" ry="6" fill="#7c3aed" />
      <ellipse cx="22" cy="-6" rx="5" ry="2" fill="#8b5cf6" />
      <path d="M27 -3 Q32 -3 32 1 Q32 5 27 5" fill="none" stroke="#6d28d9" strokeWidth="1.5" />
    </g>
  );
}

function Whiteboard({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-40" y="-60" width="80" height="60" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="-38" y="-58" width="76" height="56" rx="2" fill="#f1f5f9" />
      <text x="-32" y="-46" fill="#1e293b" fontSize="6" fontFamily="sans-serif" fontWeight="bold">TASKS</text>
      {["✓ Data Sync", "✓ Email Triage", "✓ Report Gen", "⬡ Bug Fixes", "⬡ Deploy"].map((t, i) => (
        <text key={i} x="-32" y={-36 + i * 9} fill={t.startsWith("✓") ? "#16a34a" : "#475569"} fontSize="5.5" fontFamily="sans-serif">{t}</text>
      ))}
      {/* Frame */}
      <rect x="-40" y="-60" width="80" height="5" rx="2" fill="#64748b" />
      <rect x="-3" y="0" width="6" height="8" fill="#64748b" />
    </g>
  );
}

function KanbanBoard({ x, y, activeCol = 1 }) {
  const cols = ["Todo", "Doing", "Done"];
  const colColors = ["#475569", "#7c3aed", "#16a34a"];
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-45" y="-70" width="90" height="72" rx="4" fill="#0f172a" stroke="#7c3aed" strokeWidth="1" />
      <text x="0" y="-57" textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace" fontWeight="bold">KANBAN</text>
      {cols.map((col, i) => (
        <g key={col} transform={`translate(${-38 + i * 28}, -52)`}>
          <rect width="24" height="48" rx="3" fill="#1e293b" />
          <text x="12" y="10" textAnchor="middle" fill={colColors[i]} fontSize="5" fontFamily="monospace">{col}</text>
          {i === activeCol && (
            <>
              <rect x="2" y="13" width="20" height="12" rx="2" fill="#7c3aed" opacity="0.9">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
              </rect>
              <text x="12" y="21" textAnchor="middle" fill="white" fontSize="4" fontFamily="monospace">active</text>
              <rect x="2" y="27" width="20" height="8" rx="2" fill="#4c1d95" opacity="0.6" />
            </>
          )}
          {i < activeCol && (
            <rect x="2" y="13" width="20" height="10" rx="2" fill="#14532d" opacity="0.8" />
          )}
        </g>
      ))}
    </g>
  );
}

function SpeechBubble({ x, y, text, color = "#60a5fa" }) {
  const w = text.length * 4.5 + 16;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-w/2} y="-16" width={w} height="18" rx="9" fill={color} opacity="0.95" />
      <polygon points={`-4,2 4,2 0,9`} fill={color} opacity="0.95" />
      <text x="0" y="-3" textAnchor="middle" fill="white" fontSize="6" fontFamily="monospace" fontWeight="bold">{text}</text>
    </g>
  );
}

// ─── MAIN SCENE ───────────────────────────────────────────────────────────────
function OfficeScene({ agent, tick }) {
  const kanbanCol = agent.status === "active" || agent.status === "thinking" ? 1 : agent.status === "ok" ? 2 : 0;

  return (
    <svg viewBox="-220 -180 440 320" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="floorGrad" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background ambient */}
      <rect x="-220" y="-180" width="440" height="320" fill="url(#ambientGlow)" />

      {/* Floor */}
      <ellipse cx="0" cy="100" rx="200" ry="60" fill="url(#floorGrad)" />
      {/* Floor tiles */}
      {[-3,-2,-1,0,1,2,3].map(xi => (
        [-1,0,1,2].map(yi => (
          <ellipse key={`${xi}${yi}`} cx={xi*50} cy={80+yi*20} rx="25" ry="10"
            fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
        ))
      ))}

      {/* Back wall */}
      <rect x="-220" y="-180" width="440" height="200" fill="#080f1a" opacity="0.6" />

      {/* Window light effect */}
      <rect x="-180" y="-170" width="80" height="100" rx="4" fill="#1e3a5f" opacity="0.3" />
      <rect x="-140" y="-170" width="2" height="100" fill="#60a5fa" opacity="0.1" />
      <rect x="-120" y="-170" width="80" height="100" rx="4" fill="#1e3a5f" opacity="0.3" />

      {/* Ceiling light beams */}
      <polygon points="0,-180 -60,20 60,20" fill="#60a5fa" opacity="0.02" />
      <ellipse cx="0" cy="20" rx="60" ry="8" fill="#60a5fa" opacity="0.05" />

      {/* Whiteboard */}
      <Whiteboard x={-120} y={-60} />

      {/* Kanban board */}
      <KanbanBoard x={100} y={-60} activeCol={kanbanCol} />

      {/* Desk */}
      <Desk x={0} y={50} />

      {/* Progress bar wall-mounted */}
      <g transform="translate(-160, 80)">
        <rect x="0" y="0" width="80" height="8" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
        <rect x="0" y="0" width={agent.tokens > 0 ? Math.min(80, (agent.tokens / 2000) * 80) : 20} height="8" rx="4" fill="#7c3aed">
          <animate attributeName="width" values="15;25;15" dur="3s" repeatCount="indefinite" />
        </rect>
        <text x="40" y="-5" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">PROGRESS</text>
      </g>

      {/* Sign top right */}
      <g transform="translate(130, -140)">
        <rect x="-35" y="-18" width="70" height="48" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
        <text x="0" y="-5" textAnchor="middle" fill="#60a5fa" fontSize="5.5" fontFamily="monospace">AUTOMATE</text>
        <text x="0" y="5" textAnchor="middle" fill="#a78bfa" fontSize="5.5" fontFamily="monospace">OPTIMIZE</text>
        <text x="0" y="15" textAnchor="middle" fill="#34d399" fontSize="5.5" fontFamily="monospace">ELEVATE</text>
        <text x="0" y="25" textAnchor="middle" fill="#fbbf24" fontSize="5" fontFamily="monospace">AI AGENTS</text>
      </g>

      {/* Robot at whiteboard - writing */}
      <CuteRobot x={-145} y={-10} color="#f0f9ff" size={0.7} action="working" tick={tick} label="" />

      {/* Main robot at desk */}
      <CuteRobot x={0} y={10} color="#ffffff" size={0.85} action={agent.status === "idle" ? "idle" : agent.status === "thinking" ? "thinking" : "working"} tick={tick} label="" />

      {/* Robot delivering - running with papers */}
      <g transform={`translate(${80 + Math.sin(tick * 0.04) * 8}, ${-20 + Math.abs(Math.sin(tick * 0.08)) * -5})`}>
        <CuteRobot x={0} y={0} color="#eff6ff" size={0.65} action="delivering" tick={tick} />
        {/* Papers */}
        <g transform="translate(12, -15)" style={{ transform: `rotate(${Math.sin(tick*0.06) * 5}deg)` }}>
          <rect x="-8" y="-10" width="16" height="20" rx="1" fill="white" transform="rotate(-5)" />
          <rect x="-8" y="-10" width="16" height="20" rx="1" fill="#f1f5f9" transform="rotate(2)" />
          <rect x="-8" y="-10" width="16" height="20" rx="1" fill="#e2e8f0" />
          <text x="0" y="2" textAnchor="middle" fill="#7c3aed" fontSize="4" fontFamily="sans-serif" fontWeight="bold">Q2</text>
          <text x="0" y="8" textAnchor="middle" fill="#7c3aed" fontSize="3.5" fontFamily="sans-serif">REPORT</text>
        </g>
      </g>

      {/* Background robot 1 - waving */}
      <CuteRobot x={-60} y={-60} color="#e0f2fe" size={0.55} action="idle" tick={tick + 20} />

      {/* Background robot 2 */}
      <CuteRobot x={155} y={30} color="#f0fdf4" size={0.6} action="thinking" tick={tick + 40} label="" />

      {/* Speech bubbles */}
      {agent.status === "thinking" && (
        <SpeechBubble x={0} y={-50} text="thinking..." color="#7c3aed" />
      )}
      {agent.status === "active" || agent.status === "ok" ? (
        <SpeechBubble x={80} y={-65} text="ON IT!" color="#16a34a" />
      ) : null}
      {agent.status === "idle" && tick % 120 < 60 && (
        <SpeechBubble x={-145} y={-55} text="ready!" color="#60a5fa" />
      )}

      {/* Data "BOX CODE DEPLOY" */}
      <g transform="translate(160, 60)">
        <rect x="-20" y="-20" width="40" height="30" rx="3" fill="#451a03" stroke="#92400e" strokeWidth="1" />
        <rect x="-20" y="-20" width="40" height="8" rx="2" fill="#92400e" />
        <text x="0" y="-13" textAnchor="middle" fill="#fef3c7" fontSize="4.5" fontFamily="monospace">CODE</text>
        <text x="0" y="0" textAnchor="middle" fill="#fbbf24" fontSize="4" fontFamily="monospace">DEPLOY</text>
        <text x="0" y="6" textAnchor="middle" fill="#f59e0b" fontSize="4" fontFamily="monospace">v4.0</text>
      </g>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <circle key={i}
          cx={-180 + i * 70}
          cy={-100 + Math.sin((tick * 0.03) + i * 1.2) * 20}
          r="2" fill="#7c3aed" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Active node label */}
      <g transform="translate(-200, 110)">
        <rect x="0" y="0" width="85" height="28" rx="4" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
        <text x="8" y="10" fill="#60a5fa" fontSize="5.5" fontFamily="monospace">ACTIVE NODE</text>
        <text x="8" y="20" fill="white" fontSize="5" fontFamily="monospace">hermes-agent-01</text>
      </g>
    </svg>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    idle:     ["#60a5fa", "IDLE"],
    thinking: ["#fbbf24", "THINKING"],
    active:   ["#34d399", "ACTIVE"],
    ok:       ["#34d399", "ACTIVE"],
    error:    ["#f87171", "ERROR"],
    offline:  ["#f87171", "OFFLINE"],
  };
  const [col, label] = map[status] || map.idle;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6,
      background:`${col}18`, border:`1px solid ${col}40`,
      borderRadius:6, padding:"4px 12px", fontSize:11,
      fontFamily:"monospace", color:col, letterSpacing:2 }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:col,
        boxShadow:`0 0 8px ${col}`, animation:status!=="idle"?"blink 1s infinite":"none" }}/>
      {label}
    </span>
  );
}

// ─── LOG FEED ─────────────────────────────────────────────────────────────────
function LogFeed({ messages }) {
  const ref = useRef();
  useEffect(() => { if(ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages]);
  if (!messages.length) return (
    <div style={{ color:"#475569", fontSize:11, fontFamily:"monospace", padding:"8px 0", textAlign:"center" }}>
      Waiting for Hermes...
    </div>
  );
  return (
    <div ref={ref} style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
      {messages.map((m, i) => (
        <div key={m.id||i} style={{
          padding:"8px 12px", borderRadius:6, fontSize:10, fontFamily:"monospace",
          background: m.type==="cron" ? "rgba(52,211,153,0.06)" : m.type==="embed" ? "rgba(167,139,250,0.07)" : "rgba(255,255,255,0.03)",
          borderLeft:`2px solid ${m.type==="cron"?"#34d399":m.type==="embed"?"#a78bfa":"#60a5fa"}`
        }}>
          {m.type==="cron" ? (
            <>
              <div style={{ color:"#34d399", marginBottom:3, fontWeight:"bold" }}>{m.task || "Cron Task"}</div>
              <div style={{ color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{m.content?.slice(0,200)}</div>
              <div style={{ marginTop:4, display:"flex", gap:12 }}>
                {m.runtime && <span style={{ color:"#fbbf24" }}>⏱ {m.runtime}</span>}
                {m.tokens  && <span style={{ color:"#a78bfa" }}>🔤 {m.tokens} tok</span>}
                <span style={{ color: m.status==="ok"?"#34d399":"#f87171" }}>{m.status==="ok"?"✅":"❌"}</span>
              </div>
            </>
          ) : m.type==="embed" ? (
            m.embeds?.map((e,j) => (
              <div key={j}>
                {e.title && <div style={{ color:"#a78bfa", fontWeight:"bold", marginBottom:2 }}>{e.title}</div>}
                {e.description && <div style={{ color:"#cbd5e1", marginBottom:3 }}>{e.description}</div>}
                {e.fields?.map(f => (
                  <span key={f.name} style={{ marginRight:10, color:"#34d399" }}>{f.name}: <span style={{ color:"#fff" }}>{f.value}</span></span>
                ))}
              </div>
            ))
          ) : (
            <span style={{ color:"#e2e8f0" }}>{m.content?.slice(0,200)}</span>
          )}
          <div style={{ color:"#334155", fontSize:9, marginTop:3 }}>{new Date(m.ts).toLocaleTimeString("id-ID")}</div>
        </div>
      ))}
    </div>
  );
}

// ─── COMMAND INPUT ────────────────────────────────────────────────────────────
function CommandInput({ onSend, disabled }) {
  const [val, setVal] = useState("");
  const send = () => { if(val.trim()) { onSend(val.trim()); setVal(""); } };
  return (
    <div style={{ display:"flex", gap:8, padding:"10px 16px", borderTop:"1px solid #1e293b" }}>
      <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
        placeholder="Send command to Hermes..." disabled={disabled}
        style={{ flex:1, background:"#0f172a", border:"1px solid #1e293b", borderRadius:6,
          padding:"8px 12px", color:"#e2e8f0", fontFamily:"monospace", fontSize:11, outline:"none" }} />
      <button onClick={send} disabled={disabled||!val.trim()}
        style={{ background:"#1e1b4b", border:"1px solid #7c3aed", borderRadius:6,
          color:"#a78bfa", padding:"8px 16px", fontSize:11, fontFamily:"monospace",
          cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1 }}>SEND</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function HermesHub() {
  const [messages, setMessages] = useState([]);
  const [health,   setHealth]   = useState({ ok: false });
  const [agent,    setAgent]    = useState({ status:"idle", task:"Connecting...", tokens:0, runtime:"--" });
  const [uptime,   setUptime]   = useState(0);
  const [tick,     setTick]     = useState(0);
  const [sending,  setSending]  = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error,    setError]    = useState(null);

  useEffect(() => { const t = setInterval(() => setTick(n=>n+1), 100); return ()=>clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setUptime(u=>u+1), 1000); return ()=>clearInterval(t); }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const r = await fetch("/api/health");
      const d = await r.json();
      setHealth(d);
    } catch { setHealth({ ok:false }); }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const r = await fetch("/api/messages");
      const d = await r.json();
      if (!d.ok) { setError(d.error); return; }
      setError(null);
      setMessages(d.messages || []);
      setLastSync(new Date());
      const msgs = d.messages || [];
      if (!msgs.length) return;
      let status="idle", task="Standby", tokens=0, runtime="--";
      msgs.slice(0,5).forEach(m => {
        if (m.tokens)  tokens  = m.tokens;
        if (m.runtime) runtime = m.runtime;
        if (m.task)    task    = m.task;
        if (m.status === "ok") status = "active";
        if (m.content?.includes("Thinking")||m.content?.includes("🤔")) status = "thinking";
        if (m.content?.includes("Error")||m.content?.includes("❌"))    status = "error";
      });
      setAgent({ status, task: task||msgs[0].content?.slice(0,60)||"Running", tokens, runtime });
    } catch(e) { setError(e.message); }
  }, []);

  useEffect(() => {
    fetchHealth(); fetchMessages();
    const h = setInterval(fetchHealth, 10000);
    const m = setInterval(fetchMessages, 5000);
    return () => { clearInterval(h); clearInterval(m); };
  }, [fetchHealth, fetchMessages]);

  const sendCommand = async (content) => {
    setSending(true);
    try {
      await fetch("/api/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({content}) });
      setTimeout(fetchMessages, 1500);
    } finally { setSending(false); }
  };

  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ minHeight:"100vh", background:"#050d1a", color:"#e2e8f0", fontFamily:"monospace", display:"flex", flexDirection:"column" }}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0f172a}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #1e293b",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(5,13,26,0.95)", backdropFilter:"blur(10px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#7c3aed,#2563eb)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🤖</div>
          <div>
            <span style={{ fontSize:14, fontWeight:"bold", letterSpacing:3, color:"white" }}>
              HERMES<span style={{ color:"#7c3aed" }}>HUB</span>
            </span>
            <div style={{ fontSize:8, color:"#475569", letterSpacing:2, marginTop:1 }}>AGENT CONTROL CENTER</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          {error && <span style={{ fontSize:9, color:"#f87171", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>⚠ {error}</span>}
          <Badge status={health.ok ? agent.status : "offline"} />
          <div style={{ textAlign:"right", fontSize:9, color:"#475569" }}>
            <div>UP {fmt(uptime)}</div>
            <div>{lastSync ? lastSync.toLocaleTimeString("id-ID") : "syncing..."}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>
        {/* Scene */}
        <div style={{ flex:"0 0 56%", position:"relative", overflow:"hidden",
          background:"radial-gradient(ellipse at 40% 60%, #0f1f3d 0%, #050d1a 70%)" }}>
          <OfficeScene agent={agent} tick={tick} />
        </div>

        {/* Right panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", borderLeft:"1px solid #1e293b", overflow:"hidden" }}>
          {/* Metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, borderBottom:"1px solid #1e293b", flexShrink:0 }}>
            {[
              { label:"TOKENS",   value: agent.tokens?.toLocaleString()||"0",  color:"#34d399" },
              { label:"RUNTIME",  value: agent.runtime||"--",                   color:"#fbbf24" },
              { label:"MESSAGES", value: messages.length,                        color:"#a78bfa" },
              { label:"DISCORD",  value: "CONNECTED",                            color:"#60a5fa" },
            ].map(m => (
              <div key={m.label} style={{ padding:"12px 16px", background:"rgba(255,255,255,0.015)" }}>
                <div style={{ fontSize:8, color:"#475569", letterSpacing:1, marginBottom:4 }}>{m.label}</div>
                <div style={{ fontSize:18, color:m.color, fontWeight:"bold" }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Task */}
          <div style={{ padding:"10px 16px", borderBottom:"1px solid #1e293b", flexShrink:0 }}>
            <div style={{ fontSize:8, color:"#475569", letterSpacing:1, marginBottom:4 }}>CURRENT TASK</div>
            <div style={{ fontSize:11, color:"#e2e8f0", lineHeight:1.5, minHeight:16 }}>{agent.task}</div>
          </div>

          {/* Feed */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:"10px 16px 0" }}>
            <div style={{ fontSize:8, color:"#475569", letterSpacing:1, marginBottom:6, flexShrink:0 }}>DISCORD FEED</div>
            <LogFeed messages={messages} />
          </div>

          {/* Command input */}
          <CommandInput onSend={sendCommand} disabled={sending} />
        </div>
      </div>
    </div>
  );
}
