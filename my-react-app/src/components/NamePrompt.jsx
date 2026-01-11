import { useState } from "react";

export default function NamePrompt({ onSubmit }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    await onSubmit(name.trim());
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "50px 40px",
          maxWidth: "420px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>👋</div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a202c",
              margin: "0 0 10px 0",
            }}
          >
            Welcome!
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#718096",
              margin: "0",
            }}
          >
            Let's get to know you better
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "15px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              background:
                loading || !name.trim()
                  ? "#cbd5e0"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "10px",
              cursor: loading || !name.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow:
                loading || !name.trim()
                  ? "none"
                  : "0 4px 15px rgba(102, 126, 234, 0.4)",
              marginTop: "10px",
            }}
            onMouseEnter={(e) => {
              if (!loading && name.trim()) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && name.trim()) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          We'll use this to personalize your experience
        </div>
      </div>
    </div>
  );
}
