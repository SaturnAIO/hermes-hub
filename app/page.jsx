"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── ROBOT COMPONENT ──────────────────────────────────────────────────────────
function Robot({ color = "#ffffff", eyeColor = "#60a5fa", size = 80, action = "idle", delay = 0, label = "", showBubble = false, bubbleText = "" }) {
  const [bobOffset, setBobOffset] = useState(0);
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;
      setBobOffset(Math.sin(t + delay) * 4);
    }, 50);
    return () => clearInterval(interval);
  }, [delay]);

  const glowColor = { idle: "#60a5fa", thinking: "#fbbf24", active: "#34d399", working: "#a78bfa", error: "#f87171" }[action] || "#60a5fa";
  const s = size / 80;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
      {showBubble && bubbleText && (
        <div style={{
          position: "absolute", top: -36, left: "50%", transform: "translateX(-50%)",
          background: glowColor, borderRadius: 12, padding: "4px 10px",
          fontSize: 10, fontWeight: "bold", color: "white", whiteSpace: "nowrap",
          boxShadow: `0 0 12px ${glowColor}66`, zIndex: 10
        }}>
          {bubbleText}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${glowColor}` }} />
        </div>
      )}
      <div style={{ transform: `translateY(${bobOffset}px)`, transition: "transform 0.1s ease", position: "relative" }}>
        <svg width={size} height={size * 1.4} viewBox="0 0 80 112" fill="none">
          {/* Glow base */}
          <ellipse cx="40" cy="108" rx="28" ry="6" fill={glowColor} opacity="0.2" />
          {/* Legs */}
          <rect x="26" y="88" width="12" height="18" rx="6" fill="#cbd5e1" />
          <rect x="42" y="88" width="12" height="18" rx="6" fill="#cbd5e1" />
          {/* Body */}
          <rect x="16" y="48" width="48" height="46" rx="14" fill={color} />
          {/* Body detail */}
          <rect x="28" y="60" width="24" height="14" rx="4" fill={glowColor} opacity="0.15" />
          {/* Chest light */}
          <circle cx="40" cy="67" r="5" fill={glowColor} opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" begin={`${delay}s`} />
          </circle>
          {/* Arms */}
          <rect x="2" y="52" width="14" height="28" rx="7" fill={color} transform={action === "working" ? "rotate(-15 9 66)" : "rotate(5 9 66)"} />
          <rect x="64" y="52" width="14" height="28" rx="7" fill={color} transform={action === "delivering" ? "rotate(20 71 66)" : "rotate(-5 71 66)"} />
          {/* Neck */}
          <rect x="34" y="38" width="12" height="12" rx="4" fill={color} />
          {/* Head */}
          <rect x="12" y="4" width="56" height="48" rx="20" fill={color} />
          {/* Face visor */}
          <rect x="18" y="12" width="44" height="32" rx="12" fill="#0f172a" />
          {/* Eyes */}
          <circle cx="30" cy="28" r="8" fill={glowColor} style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}>
            {action === "thinking" && <animate attributeName="r" values="7;10;7" dur="0.8s" repeatCount="indefinite" />}
          </circle>
          <circle cx="50" cy="28" r="8" fill={glowColor} style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}>
            {action === "thinking" && <animate attributeName="r" values="7;10;7" dur="0.8s" repeatCount="indefinite" begin="0.2s" />}
          </circle>
          {/* Eye shine */}
          <circle cx="27" cy="25" r="3" fill="white" opacity="0.9" />
          <circle cx="47" cy="25" r="3" fill="white" opacity="0.9" />
          {/* Smile */}
          <path d="M 26 38 Q 40 46 54 38" stroke={glowColor} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Antenna */}
          <line x1="40" y1="4" x2="40" y2="-8" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="-12" r="5" fill={glowColor} style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin={`${delay * 0.3}s`} />
          </circle>
        </svg>
      </div>
      {label && <div style={{ fontSize: 9, color: glowColor, fontFamily: "monospace", letterSpacing: 1, opacity: 0.8 }}>{label}</div>}
    </div>
  );
}

// ─── OFFICE SCENE ─────────────────────────────────────────────────────────────
function OfficeScene({ agent }) {
  const action = agent.status === "thinking" ? "thinking" : agent.status === "active" || agent.status === "ok" ? "active" : "idle";

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden",
      background: "linear-gradient(160deg, #0a1628 0%, #0d1f3c 40%, #060e1e 100%)"
    }}>
      {/* Grid floor */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
        backgroundImage: "linear-gradient(rgba(96,165,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)"
      }} />

      {/* Ambient glows */}
      <div style={{ position:"absolute", top:"20%", left:"20%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, #7c3aed22 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"30%", right:"15%", width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle, #2563eb22 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* TOP: Sign */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: "rgba(15,23,42,0.9)", border: "1px solid #1e3a5f",
        borderRadius: 8, padding: "8px 14px", textAlign: "center"
      }}>
        {["AUTOMATE", "OPTIMIZE", "ELEVATE"].map((w, i) => (
          <div key={w} style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: 2, fontWeight: "bold",
            color: ["#60a5fa", "#a78bfa", "#34d399"][i] }}>{w}</div>
        ))}
        <div style={{ fontSize: 9, color: "#fbbf24", fontFamily: "monospace", marginTop: 2, letterSpacing: 1 }}>AI AGENTS</div>
      </div>

      {/* Whiteboard left */}
      <div style={{
        position: "absolute", top: 16, left: 16, width: 120,
        background: "#f8fafc", borderRadius: 8, padding: "10px 12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)", border: "3px solid #64748b"
      }}>
        <div style={{ fontSize: 9, fontWeight: "bold", color: "#1e293b", marginBottom: 6, letterSpacing: 1 }}>TASKS</div>
        {[["✓","Data Sync","#16a34a"], ["✓","Email Triage","#16a34a"], ["✓","Report Gen","#16a34a"], ["□","Bug Fixes","#64748b"], ["□","Deploy","#64748b"]].map(([icon, task, col]) => (
          <div key={task} style={{ fontSize: 8, color: col, marginBottom: 3, fontFamily: "monospace", display: "flex", gap: 4 }}>
            <span>{icon}</span><span>{task}</span>
          </div>
        ))}
        <div style={{ marginTop: 6, height: 2, background: "#e2e8f0", borderRadius: 1 }}>
          <div style={{ width: "60%", height: "100%", background: "#7c3aed", borderRadius: 1 }} />
        </div>
        <div style={{ fontSize: 7, color: "#94a3b8", marginTop: 2 }}>Progress 60%</div>
      </div>

      {/* Kanban board right-center */}
      <div style={{
        position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
        background: "rgba(15,23,42,0.95)", border: "1px solid #7c3aed44",
        borderRadius: 8, padding: "8px 12px", minWidth: 160
      }}>
        <div style={{ fontSize: 9, color: "#a78bfa", fontFamily: "monospace", textAlign: "center", marginBottom: 6, letterSpacing: 2 }}>KANBAN</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Todo", "Doing", "Done"].map((col, i) => {
            const active = action === "active" ? 1 : action === "idle" ? 2 : 0;
            return (
              <div key={col} style={{ flex: 1, background: "#0f172a", borderRadius: 4, padding: "4px 4px 6px" }}>
                <div style={{ fontSize: 7, color: ["#64748b","#7c3aed","#16a34a"][i], textAlign: "center", marginBottom: 3, fontFamily: "monospace" }}>{col}</div>
                {i === active && (
                  <div style={{ background: "#7c3aed", borderRadius: 3, padding: "3px 4px", fontSize: 7, color: "white", fontFamily: "monospace", textAlign: "center" }}>
                    active
                  </div>
                )}
                {i < active && <div style={{ background: "#14532d", borderRadius: 3, height: 14 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Robots row */}
      <div style={{
        position: "absolute", bottom: "22%", left: 0, right: 0,
        display: "flex", alignItems: "flex-end", justifyContent: "space-around",
        padding: "0 20px"
      }}>
        {/* Robot 1 - at whiteboard */}
        <Robot color="#f0f9ff" eyeColor="#60a5fa" size={68} action="working" delay={0} label="data-01" />

        {/* Robot 2 - thinking */}
        <Robot color="#faf5ff" eyeColor="#a78bfa" size={58} action="thinking" delay={0.8} label="" />

        {/* Main robot center */}
        <div style={{ position: "relative" }}>
          <Robot color="#ffffff" eyeColor="#60a5fa" size={86} action={action} delay={0.3}
            showBubble={action === "thinking"} bubbleText="thinking..."
          />
        </div>

        {/* Robot 4 - delivering with papers */}
        <div style={{ position: "relative" }}>
          {action === "active" && (
            <div style={{
              position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
              background: "#16a34a", borderRadius: 10, padding: "3px 8px",
              fontSize: 9, color: "white", fontFamily: "monospace", fontWeight: "bold", whiteSpace: "nowrap"
            }}>ON IT!</div>
          )}
          <Robot color="#f0fdf4" eyeColor="#34d399" size={68} action="delivering" delay={1.2} label="" />
          {/* Papers */}
          <div style={{
            position: "absolute", top: "20%", right: -20,
            background: "white", borderRadius: 4, padding: "4px 6px",
            transform: "rotate(8deg)", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            fontSize: 8, color: "#7c3aed", fontWeight: "bold", fontFamily: "sans-serif"
          }}>
            Q2<br />REPORT
          </div>
        </div>

        {/* Robot 5 - background */}
        <Robot color="#eff6ff" eyeColor="#60a5fa" size={56} action="idle" delay={1.6} label="data-02" />
      </div>

      {/* Desk */}
      <div style={{
        position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)",
        width: 180, height: 40,
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "0 0 8px 8px", border: "1px solid #334155",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
      }}>
        <div style={{ width: 50, height: 32, background: "#0a0a1a", borderRadius: 3, border: "1px solid #60a5fa44",
          display: "flex", flexDirection: "column", justifyContent: "center", padding: "3px 4px", gap: 2 }}>
          <div style={{ height: 2, background: "#60a5fa", borderRadius: 1, width: "70%" }} />
          <div style={{ height: 2, background: "#34d399", borderRadius: 1, width: "50%" }} />
          <div style={{ height: 2, background: "#94a3b8", borderRadius: 1, width: "80%" }} />
        </div>
        <div style={{ fontSize: 8, color: "#34d399", fontFamily: "monospace" }}>● ONLINE</div>
      </div>

      {/* Code deploy box */}
      <div style={{
        position: "absolute", bottom: "22%", right: 12,
        background: "#451a03", border: "1px solid #92400e",
        borderRadius: 6, padding: "6px 10px", fontSize: 8, fontFamily: "monospace"
      }}>
        <div style={{ color: "#fef3c7", fontWeight: "bold" }}>CODE</div>
        <div style={{ color: "#fbbf24" }}>DEPLOY</div>
        <div style={{ color: "#f59e0b" }}>v4.0 ✓</div>
      </div>

      {/* Floor glow line */}
      <div style={{
        position: "absolute", bottom: "20%", left: "10%", right: "10%", height: 1,
        background: "linear-gradient(90deg, transparent, #7c3aed44, #60a5fa44, transparent)"
      }} />

      {/* Active node label */}
      <div style={{
        position: "absolute", bottom: 12, left: 12,
        background: "rgba(15,23,42,0.9)", border: "1px solid #1e293b",
        borderRadius: 6, padding: "6px 10px", fontSize: 9, fontFamily: "monospace"
      }}>
        <div style={{ color: "#60a5fa", marginBottom: 2, letterSpacing: 1 }}>ACTIVE NODE</div>
        <div style={{ color: "#e2e8f0" }}>hermes-agent-01</div>
        <div style={{ color: "#475569" }}>Hyonix VPS · Windows</div>
      </div>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    idle:     ["#60a5fa","IDLE"],
    thinking: ["#fbbf24","THINKING"],
    active:   ["#34d399","ACTIVE"],
    ok:       ["#34d399","ACTIVE"],
    error:    ["#f87171","ERROR"],
    offline:  ["#f87171","OFFLINE"],
  };
  const [col, label] = map[status] || map.idle;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6,
      background:`${col}15`, border:`1px solid ${col}50`,
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
    <div style={{ color:"#334155", fontSize:11, fontFamily:"monospace", padding:"16px 0", textAlign:"center" }}>
      Waiting for Hermes...
    </div>
  );
  return (
    <div ref={ref} style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
      {messages.map((m, i) => (
        <div key={m.id||i} style={{
          padding:"8px 12px", borderRadius:6, fontSize:10, fontFamily:"monospace",
          background: m.type==="cron"?"rgba(52,211,153,0.05)":m.type==="embed"?"rgba(167,139,250,0.05)":"rgba(255,255,255,0.02)",
          borderLeft:`2px solid ${m.type==="cron"?"#34d399":m.type==="embed"?"#a78bfa":"#60a5fa"}`
        }}>
          {m.type==="cron" ? (
            <>
              <div style={{ color:"#34d399", marginBottom:3, fontWeight:"bold" }}>{m.task||"Cron Task"}</div>
              <div style={{ color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{m.content?.slice(0,200)}</div>
              <div style={{ marginTop:4, display:"flex", gap:12 }}>
                {m.runtime&&<span style={{color:"#fbbf24"}}>⏱ {m.runtime}</span>}
                {m.tokens&&<span style={{color:"#a78bfa"}}>🔤 {m.tokens} tok</span>}
                <span style={{color:m.status==="ok"?"#34d399":"#f87171"}}>{m.status==="ok"?"✅":"❌"}</span>
              </div>
            </>
          ) : m.type==="embed" ? (
            m.embeds?.map((e,j)=>(
              <div key={j}>
                {e.title&&<div style={{color:"#a78bfa",fontWeight:"bold",marginBottom:2}}>{e.title}</div>}
                {e.description&&<div style={{color:"#cbd5e1",marginBottom:3}}>{e.description}</div>}
                {e.fields?.map(f=>(
                  <span key={f.name} style={{marginRight:10,color:"#34d399"}}>{f.name}: <span style={{color:"#fff"}}>{f.value}</span></span>
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
          padding:"8px 12px", color:"#e2e8f0", fontFamily:"monospace", fontSize:11, outline:"none",
          transition:"border-color 0.2s" }}
        onFocus={e=>e.target.style.borderColor="#7c3aed"}
        onBlur={e=>e.target.style.borderColor="#1e293b"}
      />
      <button onClick={send} disabled={disabled||!val.trim()}
        style={{ background: val.trim()&&!disabled ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "#1e293b",
          border:"none", borderRadius:6, color:"white", padding:"8px 16px",
          fontSize:11, fontFamily:"monospace", cursor:disabled?"not-allowed":"pointer",
          opacity:disabled?0.5:1, transition:"all 0.2s" }}>SEND</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function HermesHub() {
  const [messages, setMessages]  = useState([]);
  const [health,   setHealth]    = useState({ ok: false });
  const [agent,    setAgent]     = useState({ status:"idle", task:"Connecting...", tokens:0, runtime:"--" });
  const [uptime,   setUptime]    = useState(0);
  const [sending,  setSending]   = useState(false);
  const [lastSync, setLastSync]  = useState(null);
  const [error,    setError]     = useState(null);

  useEffect(() => { const t = setInterval(()=>setUptime(u=>u+1), 1000); return ()=>clearInterval(t); }, []);

  const fetchHealth = useCallback(async () => {
    try { const r = await fetch("/api/health"); const d = await r.json(); setHealth(d); }
    catch { setHealth({ ok:false }); }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const r = await fetch("/api/messages"); const d = await r.json();
      if (!d.ok) { setError(d.error); return; }
      setError(null); setMessages(d.messages||[]); setLastSync(new Date());
      const msgs = d.messages||[];
      if (!msgs.length) return;
      let status="idle", task="Standby", tokens=0, runtime="--";
      msgs.slice(0,5).forEach(m => {
        if (m.tokens) tokens=m.tokens;
        if (m.runtime) runtime=m.runtime;
        if (m.task) task=m.task;
        if (m.status==="ok") status="active";
        if (m.content?.includes("Thinking")||m.content?.includes("🤔")) status="thinking";
        if (m.content?.includes("Error")||m.content?.includes("❌")) status="error";
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
    <div style={{ minHeight:"100vh", background:"#050d1a", color:"#e2e8f0", display:"flex", flexDirection:"column", fontFamily:"monospace" }}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0f172a}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ padding:"10px 20px", borderBottom:"1px solid #1e293b",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(5,13,26,0.98)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:34, height:34, borderRadius:10,
            background:"linear-gradient(135deg,#7c3aed,#2563eb)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:"0 0 20px #7c3aed44" }}>🤖</div>
          <div>
            <div style={{ fontSize:14, fontWeight:"bold", letterSpacing:3, color:"white" }}>
              HERMES<span style={{ color:"#7c3aed" }}>HUB</span>
            </div>
            <div style={{ fontSize:8, color:"#334155", letterSpacing:2 }}>AGENT CONTROL CENTER</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {error && <span style={{ fontSize:9, color:"#f87171" }}>⚠ {error}</span>}
          <Badge status={health.ok ? agent.status : "offline"} />
          <div style={{ textAlign:"right", fontSize:9, color:"#334155" }}>
            <div>UP {fmt(uptime)}</div>
            <div>{lastSync ? lastSync.toLocaleTimeString("id-ID") : "—"}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>
        {/* Scene */}
        <div style={{ flex:"0 0 54%", overflow:"hidden" }}>
          <OfficeScene agent={agent} />
        </div>

        {/* Right panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", borderLeft:"1px solid #1e293b", overflow:"hidden", background:"#05101e" }}>
          {/* Metrics */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", flexShrink:0 }}>
            {[
              { label:"TOKENS",   value: agent.tokens?.toLocaleString()||"0",  color:"#34d399", icon:"🔤" },
              { label:"RUNTIME",  value: agent.runtime||"—",                   color:"#fbbf24", icon:"⏱" },
              { label:"MESSAGES", value: messages.length,                        color:"#a78bfa", icon:"💬" },
              { label:"DISCORD",  value: "CONNECTED",                            color:"#60a5fa", icon:"🔗" },
            ].map((m,i) => (
              <div key={m.label} style={{
                padding:"14px 16px",
                borderBottom:"1px solid #1e293b",
                borderRight: i%2===0 ? "1px solid #1e293b" : "none"
              }}>
                <div style={{ fontSize:8, color:"#334155", letterSpacing:1, marginBottom:5 }}>{m.icon} {m.label}</div>
                <div style={{ fontSize:20, color:m.color, fontWeight:"bold", letterSpacing:-0.5 }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Task */}
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e293b", flexShrink:0 }}>
            <div style={{ fontSize:8, color:"#334155", letterSpacing:1, marginBottom:6 }}>⚡ CURRENT TASK</div>
            <div style={{ fontSize:11, color:"#e2e8f0", lineHeight:1.6 }}>{agent.task}</div>
          </div>

          {/* Feed */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", padding:"10px 16px 0" }}>
            <div style={{ fontSize:8, color:"#334155", letterSpacing:1, marginBottom:8, flexShrink:0 }}>📡 DISCORD FEED</div>
            <LogFeed messages={messages} />
          </div>

          <CommandInput onSend={sendCommand} disabled={sending} />
        </div>
      </div>
    </div>
  );
}
