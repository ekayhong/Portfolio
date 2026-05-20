import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eric Kay Hong — Développeur .NET Senior & Tech Lead";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Top — eyebrow */}
        <span
          style={{
            fontSize: 18,
            fontFamily: "sans-serif",
            fontWeight: 300,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6b6b6b",
          }}
        >
          Portfolio · Profil technique
        </span>

        {/* Middle — name + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 88,
              fontWeight: 400,
              color: "#f5f5f3",
              letterSpacing: "-0.025em",
              lineHeight: 0.9,
            }}
          >
            Eric Kay Hong
          </span>
          <span
            style={{
              fontSize: 32,
              fontFamily: "sans-serif",
              fontWeight: 300,
              color: "#999",
              letterSpacing: "-0.01em",
            }}
          >
            Développeur .NET Senior &amp; Tech Lead · 23+ ans d'expérience
          </span>
        </div>

        {/* Bottom — badges + availability */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {["C#", ".NET", "Azure", "DDD", "React"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 18,
                  fontFamily: "sans-serif",
                  fontWeight: 300,
                  color: "#f5f5f3",
                  border: "1px solid #2a2a2a",
                  borderRadius: 999,
                  padding: "6px 18px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontFamily: "sans-serif",
                fontWeight: 400,
                color: "#22c55e",
              }}
            >
              Disponible dès juillet 2026 · Monaco &amp; Remote
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
