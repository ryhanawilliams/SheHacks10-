import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendMagicLink = async (e) => {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) setMsg(error.message);
    else setMsg("Check your email for the login link ✨");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "#f5f5f5",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    card: {
      width: "min(820px, 92vw)",
      background: "#fff",
      borderRadius: 20,
      boxShadow: "0 18px 55px rgba(0,0,0,0.12)",
      padding: "56px 64px",
      boxSizing: "border-box",
      textAlign: "center",
    },
    logo: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      background: "#ff6b8f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 38,
      fontWeight: 800,
      margin: "0 auto 20px",
    },
    smallHeading: {
      fontSize: 22,
      fontWeight: 500,
      margin: 0,
      color: "#111",
    },
    bigHeading: {
      fontSize: 40,
      fontWeight: 800,
      margin: "6px 0 40px",
      color: "#000",
    },
    form: {
      maxWidth: 520,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: 22,
      textAlign: "left",
    },
    label: {
      fontSize: 15,
      fontWeight: 500,
      color: "#111",
      marginBottom: 8,
      display: "block",
    },
    input: {
      width: "100%",
      height: 56,
      borderRadius: 10,
      border: "1px solid #eee",
      background: "#f6f6f6",
      padding: "0 16px",
      fontSize: 16,
      outline: "none",
      transition: "all 0.15s ease",
    },
    button: {
      marginTop: 30,
      height: 64,
      borderRadius: 12,
      border: "none",
      background: "#ff6b8f",
      color: "#fff",
      fontSize: 18,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.15s ease",
    },
    msg: (isError) => ({
      marginTop: 24,
      padding: "14px",
      borderRadius: 10,
      fontSize: 14,
      textAlign: "center",
      background: isError ? "#fee2e2" : "#ecfdf5",
      color: isError ? "#991b1b" : "#065f46",
      border: `1px solid ${isError ? "#fecaca" : "#a7f3d0"}`,
    }),
  };

  const isError = msg.toLowerCase().includes("error");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>C</div>

        <p style={styles.smallHeading}>Hey Upcirclr,</p>
        <h1 style={styles.bigHeading}>Welcome to Circl.</h1>

        <form onSubmit={sendMagicLink} style={styles.form}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.background = "#fff";
                e.target.style.borderColor = "#ffb3c6";
              }}
              onBlur={(e) => {
                e.target.style.background = "#f6f6f6";
                e.target.style.borderColor = "#eee";
              }}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Log in
          </button>
        </form>

        {msg && <div style={styles.msg(isError)}>{msg}</div>}
      </div>
    </div>
  );
}
