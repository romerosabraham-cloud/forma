import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{position:"relative",minHeight:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8%",background:"#080B08"}}>
      
      {/* Lado izquierdo - features */}
      <div style={{flex:1,paddingRight:60,maxWidth:520}}>
        <div style={{fontFamily:"Arial Black,sans-serif",fontSize:52,fontWeight:900,color:"#C8FF45",letterSpacing:8,marginBottom:8}}>FORMA</div>
        <div style={{color:"#5A6358",fontSize:13,letterSpacing:4,marginBottom:48}}>TU CUERPO · TUS DATOS · TU PROGRESO</div>

        <div style={{display:"flex",flexDirection:"column",gap:24}}>
          {[
            {e:"📊",t:"Analytics de dispositivo",d:"Pasos, calorías, ritmo cardíaco y sueño en tiempo real desde tu teléfono"},
            {e:"🧠",t:"Coach IA personal",d:"Análisis y recomendaciones personalizadas basadas en tus métricas diarias"},
            {e:"📈",t:"Tendencias corporales",d:"Peso, composición corporal y medidas con gráficas de progreso"},
            {e:"🔥",t:"Planes adaptativos",d:"Entrenamientos y nutrición que se ajustan a tu evolución semana a semana"},
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
          <div style={{background:"#1A1A1A",border:"1px solid #252E25",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
            <div style={{fontFamily:"monospace",fontSize:22,fontWeight:700,color:"#C8FF45"}}>10k+</div>
            <div style={{fontSize:11,color:"#5A6358",marginTop:2}}>Usuarios activos</div>
          </div>
          <div style={{background:"#1A1A1A",border:"1px solid #252E25",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
            <div style={{fontFamily:"monospace",fontSize:22,fontWeight:700,color:"#C8FF45"}}>4.9★</div>
            <div style={{fontSize:11,color:"#5A6358",marginTop:2}}>Valoración media</div>
          </div>
          <div style={{background:"#1A1A1A",border:"1px solid #252E25",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
            <div style={{fontFamily:"monospace",fontSize:22,fontWeight:700,color:"#C8FF45"}}>-8kg</div>
            <div style={{fontSize:11,color:"#5A6358",marginTop:2}}>Media en 3 meses</div>
          </div>
        </div>
      </div>

      {/* Lado derecho - login */}
      <div style={{flexShrink:0}}>
        <SignIn />
      </div>

    </div>
  );
}