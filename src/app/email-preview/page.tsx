import { getWelcomeEmailHtml } from "@/lib/brevo";

export default function EmailPreviewPage() {
  const html = getWelcomeEmailHtml({
    email: "student@university.edu",
    name: "Alex",
    isBrowserPreview: true,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0e0924",
        padding: "40px 16px",
        fontFamily: "'Figtree', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 24px auto",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 8px 0" }}>
          Unideals Welcome Email Template Preview
        </h1>
        <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>
          Rendered live with responsive table layout for Brevo and all email clients
        </p>
      </div>

      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
      >
        <iframe
          srcDoc={html}
          title="Email Template Preview"
          style={{
            width: "100%",
            height: "760px",
            border: "none",
            display: "block",
            background: "#f6f7fb",
          }}
        />
      </div>
    </div>
  );
}
