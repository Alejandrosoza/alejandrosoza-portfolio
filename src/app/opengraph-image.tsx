import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Alejandro Soza — Film Director";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "1px",
            background: "#c9a96e",
            marginBottom: "32px",
          }}
        />

        <div
          style={{
            fontSize: "72px",
            fontWeight: 300,
            color: "#f0ece4",
            letterSpacing: "8px",
            textTransform: "uppercase",
          }}
        >
          ALEJANDRO SOZA
        </div>

        <div
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "#c9a96e",
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginTop: "16px",
          }}
        >
          FILM DIRECTOR
        </div>

        <div
          style={{
            width: "120px",
            height: "1px",
            background: "#c9a96e",
            marginTop: "32px",
          }}
        />

        <div
          style={{
            fontSize: "12px",
            color: "#f0ece4",
            opacity: 0.3,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginTop: "24px",
          }}
        >
          WHITEHORSE, YUKON — CANADA
        </div>
      </div>
    ),
    { ...size }
  );
}
