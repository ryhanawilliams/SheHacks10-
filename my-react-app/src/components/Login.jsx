import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");

  const sendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) alert(error.message);
    else alert("Check your email for the login link.");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
      />
      <button onClick={sendLink}>Log in</button>
    </div>
  );
}
