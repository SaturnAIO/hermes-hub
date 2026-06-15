"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── ISOMETRIC COMPONENTS ────────────────────────────────────────────────────

function IsoCell({ x, y, color = "#12122a", height = 4, label }) {
  const w = 60, h = 30;
  const px = x * w * 0.5 - y * w * 0.5;
  const py = x * h * 0.5 + y * h * 0.5;
  const darken = (col, amt) => {
    const n = parseInt(col.replace("#",""), 16);
    const r = Math.max(0,(n>>16)-amt), g = Math.max(0,((n>>8)&0xff)-amt), b = Math.max(0,(n&0xff)-amt);
    return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,"0")}`;
  };
  const top  = [[0,-height],[w/2,-height+h/2],[0,-height+h],[-w/2,-height+h/2]];
  const right = [[w/2,-height+h/2],[w/2,h/2],[0,h],[0,-height+h]];
  const left  = [[-w/2,-height+h/2],[-w/2,h/2],[0,h],[0,-height+h]];
  const pts   = a => a.map(p=>p.join(",")).join(" ");
  return (
    <g transform={`translate(${px},${py})`}>
      <polygon points={pts(top)}   fill={color}           stroke="#0a0a18" strokeWidth="0.5"/>
      <polygon points={pts(right)} fill={darken(color,25)} stroke="#0a0a18" strokeWidth="0.5"/>
      <polygon points={pts(left)}  fill={darken(color,50)} stroke="#0a0a18" strokeWidth="0.5"/>
      {label && <text x="0" y={-height-5} textAnchor="middle" fill="#4fc3f7" fontSize="6.5" fontFamily="monospace" opacity="0.7">{label}</text>}
    </g>
  );
}

function AgentAvatar({ x, y, status, tick }) {
  const w=60, h=30;
  const px = x*w*0.5 - y*w*0.5;
  const py = x*h*0.5 + y*h*0.5 - 30;
  const col = { idle:"#4fc3f7", thinking:"#ffd54f", active:"#81c784", error:"#ef5350", ok:"#81c784" }[status] || "#4fc3f7";
  const bob = Math.sin(tick * 0.1) * 2.5;
  return (
    <g transform={`translate(${px},${py+bob})`}>
      <ellipse cx="0" cy="13" rx="7" ry="10" fill={col}/>
      <circle cx="0" cy="-1" r="8" fill={col}/>
      <circle cx="-3" cy="-2" r="2" fill="#0d0d1a"/>
      <circle cx="3"  cy="-2" r="2" fill="#0d0d1a"/>
      <circle cx="-2.5" cy="-2.5" r="0.8" fill="white"/>
      <circle cx="3.5"  cy="-2.5" r="0.8" fill="white"/>
      <line x1="0" y1="-9" x2="0" y2="-15" stroke={col} strokeWidth="1.5"/>
      <circle cx="0" cy="-16" r="2.2" fill={col} style={{filter:`drop-shadow(0 0 5px ${col})`}}>
        {status==="thinking" && <animate attributeName="r" values="2.2;3.5;2.2" dur="0.8s" repeatCount="indefinite"/>}
      </circle>
      <circle cx="0" cy="-1" r="11" fill="none" stroke={col} strokeWidth="0.4" opacity="0.3" style={{filter:`drop-shadow(0 0 8px ${col})`}}/>
    </g>
  );
}

function Monitor({ x, y, lines=[] }) {
  const w=60, h=30;
  const px = x*w*0.5 - y*w*0.5;
  const py = x*h*0.5 + y*h*0.5;
  return (
    <g transform={`translate(${px},${py-42})`}>
      <rect x="-24" y="-32" width="48" height="32" rx="3" fill="#08081a" stroke="#4fc3f7" strokeWidth="0.8"/>
      <rect x="-22" y="-30" width="44" height="28" rx="2" fill="#050510"/>
      {lines.slice(0,4).map((l,i)=>(
        <text key={i} x="-19" y={-22+i*7} fill={i===0?"#4fc3f7":i===1?"#81c784":"#666"} fontSize="4.5" fontFamily="monospace">{l?.slice(0,22)}</text>
      ))}
      <rect x="-5" y="0" width="10" height="7" fill="#1a1a2e"/>
      <rect x="-12" y="7" width="24" height="3" rx="1" fill="#111128"/>
    </g>
  );
}

function KanbanWall({ x, y, status }) {
  const w=60, h=30;
  const px = x*w*0.5 - y*w*0.5 - 38;
  const py = x*h*0.5 + y*h*0.5 - 68;
  const active = status==="active"||status==="thinking" ? 1 : status==="ok" ? 2 : 0;
  return (
    <g transform={`translate(${px},${py})`}>
      <rect x="0" y="0" width="76" height="58" rx="3" fill="#0a0a1f" stroke="#7b1fa2" strokeWidth="0.7" opacity="0.92"/>
      <text x="38" y="11" textAnchor="middle" fill="#ce93d8" fontSize="6.5" fontFamily="monospace" letterSpacing="1">KANBAN</text>
      {["Todo","Doing","Done"].map((col,i)=>(
        <g key={col} transform={`translate(${3+i*24},14)`}>
          <rect width="22" height="40" rx="2" fill="#0d0d22"/>
          <text x="11" y="9" textAnchor="middle" fill="#666" fontSize="4.5" fontFamily="monospace">{col}</text>
          {i===active&&<rect x="2" y="12" width="18" height="12" rx="1.5" fill="#9c27b0" opacity="0.85">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
          </rect>}
        </g>
      ))}
    </g>
  );
}

function Scene({ agent, health, tick }) {
  const monitorLines = [
    `hermes@vps:~$`,
    agent.task?.slice(0,22) || "standby...",
    `tokens: ${agent.tokens||0}`,
    `rt: ${agent.runtime||"--"}`,
  ];
  return (
    <svg viewBox="-200 -130 400 290" style={{width:"100%",height:"100%"}}>
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#1a1a4e" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#080815" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x="-200" y="-130" width="400" height="290" fill="url(#bg)"/>

      {/* Floor */}
      {[[-1,0],[0,0],[1,0],[-2,1],[-1,1],[0,1],[1,1],[-1,2],[0,2],[1,2]].map(([x,y])=>(
        <IsoCell key={`f${x}${y}`} x={x} y={y} color={(x+y)%2===0?"#10102a":"#0d0d22"} height={3}/>
      ))}

      {/* Back walls */}
      {[[-1,0],[0,0],[1,0]].map(([x,y])=>(
        <IsoCell key={`w${x}${y}`} x={x} y={y} color="#14142e" height={38}/>
      ))}

      {/* Server rack */}
      <IsoCell x={-1} y={1} color="#1a2a1a" height={22} label="VPS"/>

      {/* Desk */}
      <IsoCell x={0} y={1} color="#2d1f10" height={14} label="Desk·01"/>

      {/* Kanban on wall */}
      <KanbanWall x={1} y={0} status={agent.status}/>

      {/* Monitor */}
      <Monitor x={0} y={1} lines={monitorLines}/>

      {/* Agent */}
      <AgentAvatar x={0} y={1} status={agent.status} tick={tick}/>

      {/* Health dot on server rack */}
      <circle
        cx={-1*60*0.5 - 1*60*0.5}
        cy={-1*30*0.5 + 1*30*0.5 - 28}
        r="3"
        fill={health.ok ? "#81c784" : "#ef5350"}
        style={{filter:`drop-shadow(0 0 5px ${health.ok?"#81c784":"#ef5350"})`}}
      >
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    idle:     ["#4fc3f7","IDLE"],
    thinking: ["#ffd54f","THINKING"],
    active:   ["#81c784","ACTIVE"],
    ok:       ["#81c784","ACTIVE"],
    error:    ["#ef5350","ERROR"],
    offline:  ["#ef5350","OFFLINE"],
  };
  const [col, label] = map[status] || map.idle;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:6,background:`${col}18`,border:`1px solid ${col}`,borderRadius:4,padding:"3px 10px",fontSize:11,fontFamily:"monospace",color:col,letterSpacing:2}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:col,boxShadow:`0 0 6px ${col}`,animation:status!=="idle"?"blink 1s infinite":"none"}}/>
      {label}
    </span>
  );
}

// ─── LOG FEED ─────────────────────────────────────────────────────────────────
function LogFeed({ messages }) {
  const ref = useRef();
  useEffect(()=>{ if(ref.current) ref.current.scrollTop = ref.current.scrollHeight; },[messages]);
  if (!messages.length) return <div style={{color:"#333",fontSize:11,fontFamily:"monospace",padding:"8px 0"}}>No messages yet...</div>;
  return (
    <div ref={ref} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
      {messages.map((m,i)=>(
        <div key={m.id||i} style={{
          padding:"7px 10px",borderRadius:4,fontSize:10,fontFamily:"monospace",
          background: m.type==="cron" ? "rgba(129,199,132,0.06)" : m.type==="embed" ? "rgba(156,39,176,0.07)" : "rgba(255,255,255,0.03)",
          borderLeft:`2px solid ${m.type==="cron"?"#81c784":m.type==="embed"?"#9c27b0":"#4fc3f7"}`
        }}>
          {m.type==="cron" ? (
            <>
              <div style={{color:"#81c784",marginBottom:3}}>{m.task || "Cron Task"}</div>
              <div style={{color:"#ccc",whiteSpace:"pre-wrap",lineHeight:1.6}}>{m.content?.slice(0,200)}</div>
              <div style={{marginTop:4,display:"flex",gap:12}}>
                {m.runtime && <span style={{color:"#ffd54f"}}>⏱ {m.runtime}</span>}
                {m.tokens  && <span style={{color:"#ce93d8"}}>🔤 {m.tokens} tok</span>}
                <span style={{color: m.status==="ok"?"#81c784":"#ef5350"}}>{m.status==="ok"?"✅":"❌"}</span>
              </div>
            </>
          ) : m.type==="embed" ? (
            <>
              {m.embeds?.map((e,j)=>(
                <div key={j}>
                  {e.title       && <div style={{color:"#ce93d8",fontWeight:"bold",marginBottom:2}}>{e.title}</div>}
                  {e.description && <div style={{color:"#ccc",marginBottom:3}}>{e.description}</div>}
                  {e.fields?.map(f=>(
                    <span key={f.name} style={{marginRight:10,color:"#81c784"}}>{f.name}: <span style={{color:"#fff"}}>{f.value}</span></span>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <span style={{color:"#ddd"}}>{m.content?.slice(0,200)}</span>
          )}
          <div style={{color:"#333",fontSize:9,marginTop:3}}>{new Date(m.ts).toLocaleTimeString("id-ID")}</div>
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
    <div style={{display:"flex",gap:6,padding:"10px 16px",borderTop:"1px solid #1a1a3e"}}>
      <input
        value={val}
        onChange={e=>setVal(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&send()}
        placeholder="Send command to Hermes..."
        disabled={disabled}
        style={{flex:1,background:"#0d0d1a",border:"1px solid #1a1a3e",borderRadius:4,padding:"7px 10px",color:"#e0e0e0",fontFamily:"monospace",fontSize:11,outline:"none"}}
      />
      <button onClick={send} disabled={disabled||!val.trim()} style={{
        background:"#1a2a3a",border:"1px solid #4fc3f7",borderRadius:4,
        color:"#4fc3f7",padding:"7px 14px",fontSize:11,fontFamily:"monospace",
        cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1
      }}>SEND</button>
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

  // Animation tick
  useEffect(()=>{
    const t = setInterval(()=>setTick(n=>n+1), 200);
    return ()=>clearInterval(t);
  },[]);

  // Uptime counter
  useEffect(()=>{
    const t = setInterval(()=>setUptime(u=>u+1), 1000);
    return ()=>clearInterval(t);
  },[]);

  // Fetch health
  const fetchHealth = useCallback(async()=>{
    try {
      const r = await fetch("/api/health");
      const d = await r.json();
      setHealth(d);
    } catch { setHealth({ ok:false }); }
  },[]);

  // Fetch Discord messages
  const fetchMessages = useCallback(async()=>{
    try {
      const r = await fetch("/api/messages");
      const d = await r.json();
      if (!d.ok) { setError(d.error); return; }
      setError(null);
      setMessages(d.messages || []);
      setLastSync(new Date());

      // Derive agent state from latest messages
      const msgs = d.messages || [];
      if (!msgs.length) return;
      const latest = msgs[0]; // Discord returns newest first
      let status = "idle";
      let task = "Standby";
      let tokens = 0;
      let runtime = "--";

      // Scan recent 5 messages for state
      msgs.slice(0,5).forEach(m=>{
        if (m.tokens)  tokens  = m.tokens;
        if (m.runtime) runtime = m.runtime;
        if (m.task)    task    = m.task;
        if (m.status === "ok") status = "active";
        if (m.content?.includes("Thinking")||m.content?.includes("🤔")) status = "thinking";
        if (m.content?.includes("Error")||m.content?.includes("❌"))    status = "error";
      });

      setAgent({ status, task: task||latest.content?.slice(0,60)||"Running", tokens, runtime });
    } catch(e) { setError(e.message); }
  },[]);

  // Poll every 5s
  useEffect(()=>{
    fetchHealth();
    fetchMessages();
    const h = setInterval(fetchHealth,   10000);
    const m = setInterval(fetchMessages,  5000);
    return ()=>{ clearInterval(h); clearInterval(m); };
  },[fetchHealth, fetchMessages]);

  // Send command
  const sendCommand = async (content) => {
    setSending(true);
    try {
      await fetch("/api/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({content}) });
      setTimeout(fetchMessages, 1500);
    } finally { setSending(false); }
  };

  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{minHeight:"100vh",background:"#080815",color:"#e0e0e0",fontFamily:"monospace",display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0a0a18}
        ::-webkit-scrollbar-thumb{background:#1e1e3e;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{padding:"10px 18px",borderBottom:"1px solid #1a1a3e",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(8,8,21,0.95)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16,filter:"drop-shadow(0 0 8px #4fc3f7)"}}>🤖</span>
          <div>
            <span style={{fontSize:13,fontWeight:"bold",letterSpacing:2}}>HERMES<span style={{color:"#4fc3f7"}}>HUB</span></span>
            <span style={{fontSize:9,color:"#333",marginLeft:10,letterSpacing:1}}>AGENT CONTROL CENTER</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {error && <span style={{fontSize:9,color:"#ef5350",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>⚠ {error}</span>}
          <Badge status={health.ok ? agent.status : "offline"}/>
          <div style={{textAlign:"right",fontSize:9,color:"#444"}}>
            <div>UP {fmt(uptime)}</div>
            <div>{lastSync ? lastSync.toLocaleTimeString("id-ID") : "syncing..."}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {/* Scene */}
        <div style={{flex:"0 0 54%",position:"relative",overflow:"hidden",background:"radial-gradient(ellipse at 40% 60%, #0d0d2a 0%, #080815 70%)"}}>
          <Scene agent={agent} health={health} tick={tick}/>
          <div style={{position:"absolute",bottom:12,left:12,background:"rgba(8,8,21,0.85)",border:"1px solid #1a1a3e",borderRadius:6,padding:"8px 14px",fontSize:9}}>
            <div style={{color:"#4fc3f7",marginBottom:3,letterSpacing:1}}>ACTIVE NODE</div>
            <div style={{color:"#fff",marginBottom:1}}>hermes-agent-01</div>
            <div style={{color:"#444"}}>Hyonix VPS · Windows</div>
            <div style={{marginTop:4,display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:health.ok?"#81c784":"#ef5350",display:"inline-block"}}/>
              <span style={{color:health.ok?"#81c784":"#ef5350"}}>{health.ok?"API ONLINE":"API OFFLINE"}</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{flex:1,display:"flex",flexDirection:"column",borderLeft:"1px solid #1a1a3e",overflow:"hidden"}}>

          {/* Metrics */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,borderBottom:"1px solid #1a1a3e",flexShrink:0}}>
            {[
              {label:"TOKENS",   value: agent.tokens?.toLocaleString()||"0",  color:"#81c784"},
              {label:"RUNTIME",  value: agent.runtime||"--",                   color:"#ffd54f"},
              {label:"MESSAGES", value: messages.length,                        color:"#ce93d8"},
              {label:"DISCORD",  value: "CONNECTED",                            color:"#4fc3f7"},
            ].map(m=>(
              <div key={m.label} style={{padding:"12px 14px",background:"rgba(255,255,255,0.015)"}}>
                <div style={{fontSize:8,color:"#444",letterSpacing:1,marginBottom:3}}>{m.label}</div>
                <div style={{fontSize:17,color:m.color,fontWeight:"bold"}}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Task */}
          <div style={{padding:"10px 14px",borderBottom:"1px solid #1a1a3e",flexShrink:0}}>
            <div style={{fontSize:8,color:"#444",letterSpacing:1,marginBottom:4}}>CURRENT TASK</div>
            <div style={{fontSize:11,color:"#e0e0e0",lineHeight:1.5,minHeight:16}}>{agent.task}</div>
          </div>

          {/* Feed */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",padding:"10px 14px 0"}}>
            <div style={{fontSize:8,color:"#444",letterSpacing:1,marginBottom:6,flexShrink:0}}>
              DISCORD FEED · #{process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID||"1513209558850601133"}
            </div>
            <LogFeed messages={messages}/>
          </div>

          {/* Command input */}
          <CommandInput onSend={sendCommand} disabled={sending||!health.ok}/>
        </div>
      </div>
    </div>
  );
}
