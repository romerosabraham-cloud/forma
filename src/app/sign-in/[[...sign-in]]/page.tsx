"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{position:"relative",minHeight:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8%",background:"#080B08"}}>
      <div style={{flex:1,paddingRight:60,maxWidth:520}}>
        <div style={{fontFamily:"Arial Black,sans-serif",fontSize:52,fontWeight:900,color:"#C8FF45",letterSpacing:8,marginBottom:8}}>FORMA</div>
        <div style={{color:"#5A6358",fontSize:13,letterSpacing:4,marginBottom:48}}>TU CUERPO · TUS DATOS · TU PROGRESO</div>
        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          {[
            {e:"📊",t:"Analytics de dispositivo",d:"Pasos, calorías, ritmo cardíaco y sueño en tiempo real"},
            {e:"🧠",t:"Coach IA personal",d:"Análisis y recomendaciones basadas en tus métricas diarias"},
            {e:"📈",t:"Tendencias corporales",d:"Peso, composición y medidas con gráficas de progreso"},
            {e:"🔥",t:"Planes adaptativos",d:"Entrenamientos y nutrición que evolucionan contigo"},
          ].map(f=>(
            <div key={f.t} style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{fontSize:28,width:44,flexShrink:0}}>{f.e}</div>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:"#F2F5F0",marginBottom:4}}>{f.t}</div>
                <div style={{fontSize:13,color:"#5A6358",lineHeight:1.6}}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:48,display:"flex",gap:16}}>
          {[["10k+","Usuarios activos"],["4.9★","Valoración media"],["-8kg","Media en 3 meses"]].map(([v,l])=>(
            <div key={l} style={{background:"#1A1A1A",border:"1px solid #252E25",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
              <div style={{fontFamily:"monospace",fontSize:22,fontWeight:700,color:"#C8FF45"}}>{v}</div>
              <div style={{fontSize:11,color:"#5A6358",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{flexShrink:0}}>
        <SignIn routing="hash"/>
      </div>
    </div>
  );
}