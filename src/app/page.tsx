"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Heart, Moon, Flame, Clock, Brain, Check, Lock, User,
  Zap, TrendingUp, ChevronRight, RefreshCw, X, Footprints, Shield,
} from "lucide-react";

// ─── TOKENS ──────────────────────────────────────────────────
const C = {
  bg: "#080B08", card: "#101410", card2: "#181E18",
  accent: "#C8FF45", red: "#FF3A5C", blue: "#45C4FF",
  gold: "#FFD566", text: "#F2F5F0", muted: "#5A6358",
  border: "#1E241E", border2: "#252E25",
};

const GOALS = [
  { id: "lose", e: "🔥", title: "Perder Grasa",   sub: "Quema calorías y define tu figura",  color: C.red   },
  { id: "gain", e: "💪", title: "Ganar Músculo",  sub: "Aumenta masa muscular y fuerza",     color: C.blue  },
  { id: "tone", e: "⚡", title: "Tonificar",      sub: "Define y fortalece tu cuerpo",       color: C.accent },
  { id: "health",e:"❤️", title: "Bienestar",      sub: "Mejora tu salud y energía vital",    color: C.gold  },
];

const W_STEPS  = [{d:"L",v:7842},{d:"M",v:9234},{d:"X",v:6100},{d:"J",v:11203},{d:"V",v:8967},{d:"S",v:12450},{d:"D",v:8432}];
const W_CAL    = [{d:"L",v:320},{d:"M",v:480},{d:"X",v:210},{d:"J",v:560},{d:"V",v:390},{d:"S",v:650},{d:"D",v:340}];
const W_WEIGHT = [{w:"S1",v:82.5},{w:"S2",v:82.1},{w:"S3",v:81.6},{w:"S4",v:81.0},{w:"S5",v:80.8},{w:"S6",v:80.3},{w:"S7",v:79.9},{w:"S8",v:79.4}];
const HR_D     = [{t:"6am",v:62},{t:"9am",v:78},{t:"12pm",v:85},{t:"3pm",v:71},{t:"6pm",v:142},{t:"9pm",v:68},{t:"12am",v:58}];

// ─── HELPER: llama a nuestra API route segura ─────────────────
async function callAI(messages: {role:string;content:string}[], system?: string) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, max_tokens: 300 }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || null;
}

// ─── COMPONENTES BASE ─────────────────────────────────────────
function Ring({ pct, color, size=88, stroke=8, children }: any) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = circ * Math.min(pct, 1);
  return (
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+"28"} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1.2s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</div>
    </div>
  );
}

function Stat({ icon:Icon, label, value, unit, color, sub }: any) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 16px",flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
        <div style={{width:28,height:28,borderRadius:8,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={13} color={color}/>
        </div>
        <span style={{fontSize:10,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1}}>{label}</span>
      </div>
      <div style={{fontFamily:"var(--font-mono)",fontSize:21,fontWeight:600,color:C.text}}>
        {value}<span style={{fontSize:12,color:C.muted}}> {unit}</span>
      </div>
      {sub && <div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

const TTip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:C.card2,border:`1px solid ${C.border2}`,borderRadius:8,padding:"8px 12px"}}>
      <div style={{fontSize:13,color:C.text}}>{payload[0].value.toLocaleString("es")} <span style={{color:C.muted}}>{unit}</span></div>
      <div style={{fontSize:11,color:C.muted}}>{label}</div>
    </div>
  );
};

// ─── PANTALLAS DE ONBOARDING ──────────────────────────────────
function Splash({ onNext }: { onNext: () => void }) {
  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% -5%, #C8FF451A 0%, ${C.bg} 65%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:44}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:78,fontWeight:900,color:C.accent,letterSpacing:10,lineHeight:1}}>FORMA</div>
        <div style={{color:C.muted,fontSize:13,letterSpacing:4,marginTop:8,textTransform:"uppercase" as const}}>Tu cuerpo · Tus datos · Tu progreso</div>
      </div>
      <div style={{display:"flex",gap:14,width:"100%",maxWidth:320}}>
        {[["📊","Analíticas\nde dispositivo"],["🏃","Seguimiento\nen tiempo real"],["🧠","Coach IA\npersonal"]].map(([e,t],i)=>(
          <div key={i} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"18px 10px",textAlign:"center",display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:26}}>{e}</div>
            <div style={{fontSize:11,color:C.muted,lineHeight:1.5,whiteSpace:"pre-line" as const}}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{width:"100%",maxWidth:360}}>
        <button onClick={onNext} style={{width:"100%",background:C.accent,color:"#000",border:"none",borderRadius:18,padding:"19px 24px",fontSize:17,fontWeight:800,cursor:"pointer"}}>
          Empezar mi transformación →
        </button>
        <div style={{textAlign:"center",marginTop:14,fontSize:13,color:C.muted}}>Gratis · Sin tarjeta de crédito</div>
      </div>
    </div>
  );
}

function GoalScreen({ onSelect }: { onSelect: (id:string) => void }) {
  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"60px 22px 40px"}}>
      <div style={{marginBottom:30}}>
        <div style={{fontSize:44,fontWeight:900,color:C.text,lineHeight:1}}>¿CUÁL ES TU</div>
        <div style={{fontSize:44,fontWeight:900,color:C.accent,lineHeight:1}}>OBJETIVO?</div>
        <div style={{color:C.muted,fontSize:14,marginTop:10}}>Personalizaremos todo según tu meta</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {GOALS.map((g)=>(
          <button key={g.id} onClick={()=>onSelect(g.id)}
            style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"20px 18px",display:"flex",alignItems:"center",gap:16,textAlign:"left",cursor:"pointer",width:"100%",transition:"border-color .2s"}}
            onMouseOver={e=>{ (e.currentTarget as HTMLElement).style.borderColor=g.color; }}
            onMouseOut={e=>{ (e.currentTarget as HTMLElement).style.borderColor=C.border; }}>
            <div style={{fontSize:38,width:52,textAlign:"center"}}>{g.e}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:16,color:C.text}}>{g.title}</div>
              <div style={{fontSize:13,color:C.muted,marginTop:3}}>{g.sub}</div>
            </div>
            <ChevronRight size={18} color={C.muted}/>
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricsScreen({ metrics, onChange, onNext }: any) {
  const [loc, setLoc] = useState(metrics);
  const upd = (k:string, v:string) => { const n={...loc,[k]:v}; setLoc(n); onChange(n); };
  const inp: React.CSSProperties = {width:"100%",background:C.card2,border:`1px solid ${C.border2}`,borderRadius:13,padding:"14px 16px",color:C.text,fontSize:16,outline:"none"};
  const bmi = loc.height&&loc.weight ? (parseFloat(loc.weight)/((parseFloat(loc.height)/100)**2)).toFixed(1) : null;
  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"60px 22px 40px"}}>
      <div style={{marginBottom:30}}>
        <div style={{fontSize:44,fontWeight:900,color:C.text,lineHeight:1}}>TUS <span style={{color:C.accent}}>DATOS</span></div>
        <div style={{color:C.muted,fontSize:14,marginTop:10}}>Para métricas 100% personalizadas</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:15}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {([["Altura (cm)","height","175"],["Peso (kg)","weight","75"]] as [string,string,string][]).map(([l,k,ph])=>(
            <div key={k}>
              <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6,textTransform:"uppercase" as const,letterSpacing:1}}>{l}</label>
              <input value={loc[k]} onChange={e=>upd(k,e.target.value)} type="number" style={inp} placeholder={ph}/>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6,textTransform:"uppercase" as const,letterSpacing:1}}>Edad</label>
            <input value={loc.age} onChange={e=>upd("age",e.target.value)} type="number" style={inp} placeholder="28"/>
          </div>
          <div>
            <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:6,textTransform:"uppercase" as const,letterSpacing:1}}>Sexo biológico</label>
            <select value={loc.sex} onChange={e=>upd("sex",e.target.value)} style={{...inp,cursor:"pointer"}}>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
        </div>
        {bmi && (
          <div style={{background:"linear-gradient(135deg,#0B180B,#0A150A)",border:`1px solid ${C.accent}30`,borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Tu IMC estimado</div>
              <div style={{fontSize:32,fontWeight:700,color:C.accent}}>{bmi}</div>
            </div>
            <div style={{fontSize:12,color:C.muted,textAlign:"right",lineHeight:1.7}}>
              <div style={{color:parseFloat(bmi)<25?C.accent:C.gold}}>{parseFloat(bmi)<18.5?"Bajo peso":parseFloat(bmi)<25?"Normal ✓":parseFloat(bmi)<30?"Sobrepeso":"Obesidad"}</div>
              <div>Rango: 18.5–24.9</div>
            </div>
          </div>
        )}
      </div>
      <button onClick={onNext} style={{width:"100%",background:C.accent,color:"#000",border:"none",borderRadius:18,padding:"19px",fontSize:16,fontWeight:800,marginTop:28,cursor:"pointer"}}>
        Continuar →
      </button>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────
function OverviewTab({ steps, goal, aiInsight, aiLoading, onRefreshAI, metrics }: any) {
  const goalObj = GOALS.find(g=>g.id===goal)||GOALS[0];
  const calories = Math.round(steps * 0.04 * (parseFloat(metrics.weight)/70));
  const activeMin = Math.round(steps/100);
  const h = new Date().getHours();
  const greeting = h<12?"Buenos días":h<20?"Buenas tardes":"Buenas noches";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:14,color:C.muted}}>{greeting} 👋</div>
          <div style={{fontSize:26,fontWeight:900,letterSpacing:1,marginTop:2,color:C.text}}>
            Meta: <span style={{color:goalObj.color}}>{goalObj.title}</span>
          </div>
        </div>
        <div style={{background:goalObj.color+"20",borderRadius:14,padding:"10px 14px",fontSize:28}}>{goalObj.e}</div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20,display:"flex",alignItems:"center",gap:18}}>
        <Ring pct={steps/10000} color={C.accent} size={94} stroke={9}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.accent}}>{Math.round(steps/100)}%</div>
          </div>
        </Ring>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14,color:C.text}}>Progreso diario</div>
          {[
            {l:"Pasos",v:steps.toLocaleString("es"),g:"10.000",pct:steps/10000,c:C.accent},
            {l:"Calorías",v:calories,g:"500 kcal",pct:calories/500,c:C.red},
            {l:"Min. activos",v:activeMin,g:"45",pct:activeMin/45,c:C.blue},
          ].map(it=>(
            <div key={it.l} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12,color:C.muted}}>{it.l}</span>
                <span style={{fontSize:12,color:C.text}}>{it.v} <span style={{color:C.muted}}>/ {it.g}</span></span>
              </div>
              <div style={{height:4,background:it.c+"25",borderRadius:2}}>
                <div style={{height:"100%",width:`${Math.min(it.pct*100,100)}%`,background:it.c,borderRadius:2,transition:"width 1.2s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Stat icon={Heart}    label="Frec. Card."  value="72"      unit="bpm"  color={C.red}    sub="Zona reposo ✓"/>
        <Stat icon={Moon}     label="Sueño"        value="7.2"     unit="h"    color={C.blue}   sub="Calidad: Buena"/>
        <Stat icon={Flame}    label="Calorías"     value={calories} unit="kcal" color={C.gold}   sub="Meta: 500 kcal"/>
        <Stat icon={Clock}    label="Act. Min."    value={activeMin} unit="min" color={C.accent} sub="Meta: 45 min"/>
      </div>

      <div style={{background:"linear-gradient(135deg,#0C1A04,#0A1502)",border:`1px solid ${C.accent}35`,borderRadius:22,padding:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Brain size={17} color={C.accent}/>
            <span style={{fontSize:14,fontWeight:700,color:C.accent}}>Coach IA · Análisis de hoy</span>
          </div>
          <button onClick={onRefreshAI} style={{background:"transparent",border:"none",padding:4,cursor:"pointer",display:"flex"}}>
            <RefreshCw size={14} color={C.muted} style={aiLoading?{animation:"spin 1s linear infinite"}:{}}/>
          </button>
        </div>
        {aiLoading
          ? <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.accent,opacity:.6}}/>)}
              <span style={{color:C.muted,fontSize:13,marginLeft:4}}>Analizando tus métricas...</span>
            </div>
          : <div style={{fontSize:14,color:C.text,lineHeight:1.65}}>{aiInsight||"Pulsa ↺ para obtener tu análisis personalizado"}</div>}
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20}}>
        <div style={{fontWeight:700,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",color:C.text}}>
          <span>Entrenamiento de hoy</span>
          <span style={{fontSize:12,color:C.accent,fontWeight:600}}>Ver plan →</span>
        </div>
        {[
          {n:"Cardio HIIT",d:"25 min",c:"320 kcal",done:true},
          {n:"Fuerza – Tren Superior",d:"40 min",c:"280 kcal",done:false},
          {n:"Movilidad y estiramientos",d:"10 min",c:"50 kcal",done:false},
        ].map(w=>(
          <div key={w.n} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,opacity:w.done?.55:1}}>
            <div style={{width:32,height:32,borderRadius:9,background:w.done?C.accent+"22":C.card2,border:`1px solid ${w.done?C.accent:C.border2}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {w.done?<Check size={13} color={C.accent}/>:<div style={{width:7,height:7,borderRadius:"50%",background:C.border2}}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:C.text,textDecoration:w.done?"line-through":"none"}}>{w.n}</div>
              <div style={{fontSize:12,color:C.muted}}>{w.d} · {w.c}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACTIVITY TAB ─────────────────────────────────────────────
function ActivityTab() {
  const avgSteps = Math.round(W_STEPS.reduce((a,b)=>a+b.v,0)/7);
  const totCal = W_CAL.reduce((a,b)=>a+b.v,0);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontSize:34,fontWeight:900,color:C.text,letterSpacing:1}}>
        ESTA <span style={{color:C.accent}}>SEMANA</span>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1}}>Pasos diarios</div>
            <div style={{fontSize:26,fontWeight:700,color:C.accent,marginTop:4}}>{avgSteps.toLocaleString("es")} <span style={{fontSize:13,color:C.muted}}>media/día</span></div>
          </div>
          <div style={{background:C.accent+"18",borderRadius:9,padding:"5px 11px",fontSize:12,color:C.accent,fontWeight:700}}>+12% ↑</div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={W_STEPS} margin={{top:5,right:0,bottom:0,left:0}}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.accent} stopOpacity={.35}/>
                <stop offset="100%" stopColor={C.accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="d" tick={{fill:C.muted,fontSize:12}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip content={<TTip unit="pasos"/>}/>
            <Area type="monotone" dataKey="v" stroke={C.accent} strokeWidth={2.5} fill="url(#sg)" dot={false} activeDot={{r:4,fill:C.accent}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1}}>Calorías quemadas</div>
            <div style={{fontSize:26,fontWeight:700,color:C.red,marginTop:4}}>{totCal.toLocaleString("es")} <span style={{fontSize:13,color:C.muted}}>esta semana</span></div>
          </div>
          <div style={{background:C.red+"18",borderRadius:9,padding:"5px 11px",fontSize:12,color:C.red,fontWeight:700}}>🔥 En racha</div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={W_CAL} margin={{top:5,right:0,bottom:0,left:0}} barSize={22}>
            <XAxis dataKey="d" tick={{fill:C.muted,fontSize:12}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip content={<TTip unit="kcal"/>}/>
            <Bar dataKey="v" fill={C.red} radius={[5,5,0,0]} opacity={.85}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1}}>Frec. cardíaca – Hoy</div>
            <div style={{fontSize:26,fontWeight:700,color:C.red,marginTop:4}}>142 <span style={{fontSize:13,color:C.muted}}>bpm pico</span></div>
          </div>
          <Heart size={20} color={C.red}/>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={HR_D} margin={{top:5,right:0,bottom:0,left:0}}>
            <defs>
              <linearGradient id="hrg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.red} stopOpacity={.4}/>
                <stop offset="100%" stopColor={C.red} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis hide domain={[50,160]}/>
            <Tooltip content={<TTip unit="bpm"/>}/>
            <Area type="monotone" dataKey="v" stroke={C.red} strokeWidth={2.5} fill="url(#hrg)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          {[["Reposo","62",C.blue],["Media","78",C.gold],["Pico","142",C.red]].map(([l,v,c])=>(
            <div key={l} style={{flex:1,background:C.card2,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:600,color:c}}>{v}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BODY TAB ─────────────────────────────────────────────────
function BodyTab({ metrics }: any) {
  const bmi = metrics.height&&metrics.weight ? (parseFloat(metrics.weight)/((parseFloat(metrics.height)/100)**2)).toFixed(1) : "22.4";
  const cur = W_WEIGHT[W_WEIGHT.length-1].v, start = W_WEIGHT[0].v;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontSize:34,fontWeight:900,color:C.text,letterSpacing:1}}>
        COMPOSICIÓN <span style={{color:C.accent}}>CORPORAL</span>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1}}>Tendencia de peso</div>
            <div style={{fontSize:30,fontWeight:700,color:C.text,marginTop:4}}>{cur} <span style={{fontSize:14,color:C.muted}}>kg</span></div>
          </div>
          <div style={{background:C.accent+"18",border:`1px solid ${C.accent}30`,borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:700,color:C.accent}}>-{(start-cur).toFixed(1)}</div>
            <div style={{fontSize:11,color:C.muted}}>kg · 8 sem.</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={155}>
          <LineChart data={W_WEIGHT} margin={{top:5,right:0,bottom:0,left:0}}>
            <XAxis dataKey="w" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis hide domain={[78,84]}/>
            <Tooltip content={<TTip unit="kg"/>}/>
            <Line type="monotone" dataKey="v" stroke={C.accent} strokeWidth={2.5} dot={{fill:C.accent,r:3}} activeDot={{r:5,fill:C.accent}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:18}}>
          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1,marginBottom:8}}>IMC</div>
          <div style={{fontSize:36,fontWeight:800,color:parseFloat(bmi)<25?C.accent:C.gold}}>{bmi}</div>
          <div style={{fontSize:12,marginTop:5,color:parseFloat(bmi)<25?C.accent:C.gold}}>{parseFloat(bmi)<25?"Normal ✓":"Sobrepeso"}</div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:18}}>
          <div style={{fontSize:11,color:C.muted,textTransform:"uppercase" as const,letterSpacing:1,marginBottom:8}}>% Grasa Est.</div>
          <div style={{fontSize:36,fontWeight:800,color:C.blue}}>18.4%</div>
          <div style={{fontSize:12,marginTop:5,color:C.blue}}>Saludable ✓</div>
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,padding:20}}>
        <div style={{fontWeight:700,marginBottom:16,color:C.text}}>Composición estimada</div>
        {[
          {l:"Masa muscular",pct:.42,v:"33.4 kg",c:C.blue},
          {l:"Masa grasa",pct:.184,v:"14.6 kg",c:C.red},
          {l:"Agua corporal",pct:.62,v:"49.3 kg",c:C.accent},
          {l:"Masa ósea",pct:.042,v:"3.3 kg",c:C.gold},
        ].map(it=>(
          <div key={it.l} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:13,color:C.muted}}>{it.l}</span>
              <span style={{fontSize:13,color:it.c}}>{it.v}</span>
            </div>
            <div style={{height:6,background:it.c+"22",borderRadius:3}}>
              <div style={{height:"100%",width:`${it.pct*100}%`,background:it.c,borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COACH TAB (PRO) ──────────────────────────────────────────
function CoachTab({ metrics, goal }: any) {
  const [msgs, setMsgs] = useState([{role:"assistant",t:"¡Hola! Soy tu Coach IA personal. Analizo tus métricas en tiempo real y puedo diseñar planes de entrenamiento y nutrición personalizados. ¿Empezamos?"}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send = async () => {
    if (!input.trim()||loading) return;
    const txt = input.trim(); setInput("");
    const newMsgs = [...msgs,{role:"user",t:txt}];
    setMsgs(newMsgs); setLoading(true);
    const gObj = GOALS.find(g=>g.id===goal)||GOALS[0];
    const system = `Eres FORMA AI, coach personal experto en fitness y nutrición. Datos: objetivo="${gObj.title}", peso=${metrics.weight}kg, altura=${metrics.height}cm, edad=${metrics.age}. Responde en español, conciso (máx 120 palabras), motivador y específico.`;
    const reply = await callAI(newMsgs.map(m=>({role:m.role,content:m.t})), system) || "¡Sigue así! ¿Alguna duda específica?";
    setMsgs([...newMsgs,{role:"assistant",t:reply}]);
    setLoading(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,height:"calc(100vh - 200px)"}}>
      <div style={{fontSize:34,fontWeight:900,color:C.text,letterSpacing:1}}>
        COACH <span style={{color:C.accent}}>IA</span>
        <span style={{fontSize:12,color:C.accent,background:C.accent+"18",borderRadius:20,padding:"3px 10px",marginLeft:10,fontWeight:700}}>PRO</span>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant"&&(
              <div style={{width:30,height:30,borderRadius:"50%",background:C.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:8,marginTop:2}}>
                <Brain size={14} color={C.accent}/>
              </div>
            )}
            <div style={{maxWidth:"78%",background:m.role==="user"?C.accent:C.card,color:m.role==="user"?"#000":C.text,borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",fontSize:14,lineHeight:1.55,border:m.role==="assistant"?`1px solid ${C.border}`:"none"}}>
              {m.t}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:6,padding:"12px 16px",background:C.card,border:`1px solid ${C.border}`,borderRadius:"18px 18px 18px 4px",width:"fit-content"}}>
          {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.muted,opacity:.7}}/>)}
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:10,background:C.card,border:`1px solid ${C.border2}`,borderRadius:18,padding:"8px 8px 8px 16px",alignItems:"center"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Pregunta a tu coach..." style={{flex:1,background:"transparent",color:C.text,fontSize:14,border:"none",outline:"none"}}/>
        <button onClick={send} style={{background:C.accent,border:"none",borderRadius:13,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─── UPGRADE MODAL ────────────────────────────────────────────
function UpgradeModal({ onClose, onUpgrade }: any) {
  return (
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:"28px 28px 0 0",padding:"32px 24px 52px",width:"100%",maxWidth:480,border:`1px solid ${C.border2}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontSize:36,fontWeight:900,color:C.gold,letterSpacing:3}}>FORMA PRO</div>
          <button onClick={onClose} style={{background:C.card2,border:`1px solid ${C.border}`,width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <X size={15} color={C.muted}/>
          </button>
        </div>
        <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Desbloquea tu potencial completo</div>
        <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:24}}>
          {[["🧠","Coach IA sin límites, respuestas 24/7"],["📊","Analíticas avanzadas y predicciones ML"],["🏋️","Planes de entrenamiento adaptativos"],["🥗","Planes de nutrición personalizados"],["⌚","Sincronización con Apple Watch y Garmin"],["📈","Historial ilimitado y exportación CSV"]].map(([e,t])=>(
            <div key={t as string} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:19}}>{e}</span>
              <span style={{fontSize:14,color:C.text,flex:1}}>{t}</span>
              <Check size={14} color={C.accent}/>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[["Mensual","9,99€","/mes",""],["Anual","5,83€","/mes · -42%","Mejor opción ✦"]].map(([p,pr,u,b])=>(
            <div key={p} style={{background:b?C.gold+"18":C.card2,border:`2px solid ${b?C.gold:C.border2}`,borderRadius:18,padding:"18px",textAlign:"center"}}>
              {b&&<div style={{fontSize:11,color:C.gold,fontWeight:700,marginBottom:4}}>{b}</div>}
              <div style={{fontSize:12,color:b?C.gold:C.muted,fontWeight:700,textTransform:"uppercase" as const,letterSpacing:1}}>{p}</div>
              <div style={{fontSize:26,fontWeight:700,color:C.text,margin:"6px 0"}}>{pr}</div>
              <div style={{fontSize:11,color:C.muted}}>{u}</div>
            </div>
          ))}
        </div>
        <button onClick={onUpgrade} style={{width:"100%",background:C.gold,color:"#000",border:"none",borderRadius:18,padding:"19px",fontSize:16,fontWeight:800,cursor:"pointer"}}>
          ⭐ Probar 7 días GRATIS
        </button>
        <div style={{textAlign:"center",marginTop:12,fontSize:12,color:C.muted}}>
          Cancela cuando quieras · Sin compromisos
        </div>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────
export default function FormaApp() {
  const [screen, setScreen] = useState("splash");
  const [tab, setTab] = useState("overview");
  const [goal, setGoal] = useState<string|null>(null);
  const [metrics, setMetrics] = useState({height:"175",weight:"80",age:"28",sex:"male"});
  const [steps, setSteps] = useState(8432);
  const [aiInsight, setAiInsight] = useState<string|null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(()=>{
    let last: number|null = null, count=0;
    const onMotion=(e: DeviceMotionEvent)=>{
      const a = e.accelerationIncludingGravity;
      if(!a||a.x===null) return;
      const mag = Math.sqrt((a.x||0)**2+(a.y||0)**2+(a.z||0)**2);
      if(last!==null&&Math.abs(mag-last)>11){ count++; if(count%2===0) setSteps(s=>s+1); }
      last=mag;
    };
    window.addEventListener("devicemotion", onMotion as EventListener);
    return ()=>window.removeEventListener("devicemotion", onMotion as EventListener);
  },[]);

  const fetchAI = async () => {
    setAiLoading(true);
    const bmi = (parseFloat(metrics.weight)/((parseFloat(metrics.height)/100)**2)).toFixed(1);
    const gLabel = GOALS.find(g=>g.id===goal)?.title||"bienestar";
    const reply = await callAI([{
      role:"user",
      content:`Coach personal experto. Da 1 insight personalizado y motivador en español (máx 2-3 frases). Sin listas. Datos: objetivo=${gLabel}, pasos=${steps.toLocaleString("es")}, calorías≈${Math.round(steps*.04)}kcal, IMC=${bmi}, peso=${metrics.weight}kg, edad=${metrics.age}. Tendencia: -3.1kg en 8 semanas. Sé específico.`
    }]);
    setAiInsight(reply || `Con ${steps.toLocaleString("es")} pasos llevas ${Math.round(steps*.04)} kcal quemadas. Tu tendencia de -3.1 kg en 8 semanas es excelente. Esta noche prioriza 8h de sueño para optimizar la recuperación.`);
    setAiLoading(false);
  };

  const TABS = [
    {id:"overview",l:"Inicio"},
    {id:"activity",l:"Actividad"},
    {id:"body",l:"Cuerpo"},
    {id:"coach",l:"Coach IA",pro:true},
  ];

  if(screen==="splash")  return <Splash onNext={()=>setScreen("goal")}/>;
  if(screen==="goal")    return <GoalScreen onSelect={g=>{setGoal(g);setScreen("metrics");}}/>;
  if(screen==="metrics") return <MetricsScreen metrics={metrics} onChange={setMetrics} onNext={()=>setScreen("app")}/>;

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,maxWidth:480,margin:"0 auto",position:"relative"}}>
      <div style={{padding:"18px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:C.bg,zIndex:10}}>
        <div style={{fontSize:30,fontWeight:900,color:C.accent,letterSpacing:5}}>FORMA</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {isPremium
            ? <div style={{background:C.gold+"22",border:`1px solid ${C.gold}40`,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700,color:C.gold}}>⭐ PRO</div>
            : <button onClick={()=>setShowUpgrade(true)} style={{background:C.gold,color:"#000",border:"none",borderRadius:20,padding:"5px 16px",fontSize:12,fontWeight:800,cursor:"pointer"}}>⭐ PRO</button>}
          <div style={{width:34,height:34,borderRadius:"50%",background:C.card2,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <User size={15} color={C.muted}/>
          </div>
        </div>
      </div>

      <div style={{display:"flex",padding:"10px 20px 0",borderBottom:`1px solid ${C.border}`,position:"sticky",top:56,background:C.bg,zIndex:10}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>{if(t.pro&&!isPremium){setShowUpgrade(true);return;}setTab(t.id);}}
            style={{flex:1,background:"transparent",border:"none",paddingBottom:12,fontSize:12,fontWeight:tab===t.id?700:400,color:tab===t.id?C.accent:C.muted,borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer"}}>
            {t.pro&&!isPremium&&<Lock size={9}/>}
            {t.l}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 20px 80px",overflowY:"auto"}}>
        {tab==="overview" && <OverviewTab steps={steps} goal={goal} aiInsight={aiInsight} aiLoading={aiLoading} onRefreshAI={fetchAI} metrics={metrics}/>}
        {tab==="activity" && <ActivityTab/>}
        {tab==="body"     && <BodyTab metrics={metrics}/>}
        {tab==="coach"    && <CoachTab metrics={metrics} goal={goal}/>}
      </div>

      {showUpgrade&&<UpgradeModal onClose={()=>setShowUpgrade(false)} onUpgrade={()=>{setIsPremium(true);setShowUpgrade(false);setTab("coach");}}/>}
    </div>
  );
}
