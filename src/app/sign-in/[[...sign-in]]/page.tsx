"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 6%",
      background: "#080B08",
      gap: 40,
    }}>

      {/* LADO IZQUIERDO - Features */}
      <div style={{flex: 1, maxWidth: 500}}>

        <div style={{
          fontFamily: "Arial Black, sans-serif",
          fontSize: 56,
          fontWeight: 900,
          color: "#C8FF45",
          letterSpacing: 10,
          lineHeight: 1,
          marginBottom: 6,
        }}>FORMA</div>

        <div style={{
          color: "#5A6358",
          fontSize: 12,
          letterSpacing: 4,
          marginBottom: 52,
          textTransform: "uppercase",
        }}>Tu cuerpo · Tus datos · Tu progreso</div>

        <div style={{display: "flex", flexDirection: "column", gap: 28}}>
          {[
            {e: "📊", t: "Analytics de dispositivo", d: "Pasos, calorías, ritmo cardíaco y sueño recogidos automáticamente de tu teléfono"},
            {e: "🧠", t: "Coach IA personal", d: "Análisis y planes personalizados basados en tus métricas diarias con IA avanzada"},
            {e: "📈", t: "Tendencias corporales", d: "Seguimiento de peso, composición corporal y medidas con gráficas de progreso"},
            {e: "🔥", t: "Planes adaptativos", d: "Entrenamientos y nutrición que evolucionan contigo semana a semana"},
          ].map(f => (
            <div key={f.t} style={{display: "flex", gap: 18, alignItems: "flex-start"}}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#1A1A1A",
                border: "1px solid #252E25",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}>{f.e}</div>
              <div>
                <div style={{fontWeight: 700, fontSize: 15, color: "#F2F5F0", marginBottom: 5}}>{f.t}</div>
                <div style={{fontSize: 13, color: "#5A6358", lineHeight: 1.65}}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop: 52, display: "flex", gap: 14}}>
          {[["10k+", "Usuarios activos"], ["4.9★", "Valoración"], ["-8kg", "Media 3 meses"]].map(([v, l]) => (
            <div key={l} style={{
              background: "#111",
              border: "1px solid #1E241E",
              borderRadius: 14,
              padding: "14px 18px",
              textAlign: "center",
              flex: 1,
            }}>
              <div style={{fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "#C8FF45"}}>{v}</div>
              <div style={{fontSize: 11, color: "#5A6358", marginTop: 4}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{marginTop: 32, padding: "16px 20px", background: "#0C1A04", border: "1px solid #C8FF4530", borderRadius: 14}}>
          <div style={{fontSize: 13, color: "#C8FF45", fontWeight: 700, marginBottom: 4}}>🎁 7 días gratis de FORMA PRO</div>
          <div style={{fontSize: 12, color: "#5A6358"}}>Sin tarjeta de crédito · Cancela cuando quieras</div>
        </div>
      </div>

      {/* LADO DERECHO - Login */}
      <div style={{flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <SignIn
          appearance={{
            elements: {
              rootBox: {
                boxShadow: "0 0 40px rgba(200, 255, 69, 0.08)",
                borderRadius: "20px",
              }
            }
          }}
        />
      </div>

    </div>
  );
}
