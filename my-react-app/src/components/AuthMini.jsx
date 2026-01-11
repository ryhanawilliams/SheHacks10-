import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthMini() {
  const [email, setEmail] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) alert(error.message);
    else alert("Check your email for the sign-in link.");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
      <button onClick={login}>Login</button>
    </div>
  );
}
