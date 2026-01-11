import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import NamePrompt from "./NamePrompt";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const checkAuthAndProfile = async () => {
      try {
        console.log("🔍 Checking auth session...");

        // Set a timeout to prevent infinite loading (5 seconds)
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.error("⏱️ Auth check timeout - forcing completion");
            setLoading(false);
            setAuthed(false);
          }
        }, 5000);

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Auth error:", error);
          clearTimeout(timeoutId);
          setLoading(false);
          return;
        }

        if (!mounted) {
          clearTimeout(timeoutId);
          return;
        }

        console.log(
          "✅ Session check complete:",
          data.session ? "logged in" : "not logged in"
        );
        const session = data.session;
        setAuthed(!!session);

        if (session?.user) {
          setUserId(session.user.id);
          // TEMPORARILY DISABLED: Skip profile check to avoid hanging
          console.log("👤 User authenticated - skipping profile check for now");
          setHasProfile(true);
        }

        clearTimeout(timeoutId);
        setLoading(false);
      } catch (err) {
        console.error("💥 Fatal error in checkAuthAndProfile:", err);
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    checkAuthAndProfile();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(
          "🔔 Auth state changed:",
          event,
          session ? "logged in" : "logged out"
        );
        if (!mounted) return;

        setAuthed(!!session);

        if (session?.user) {
          setUserId(session.user.id);
          // TEMPORARILY DISABLED: Skip profile check to avoid hanging
          setHasProfile(true);
        } else {
          setHasProfile(false);
          setUserId(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleNameSubmit = async (name) => {
    if (!userId) return;

    const { error } = await supabase.from("profiles").insert({
      id: userId,
      name: name,
    });

    if (error) {
      alert("Error saving your name: " + error.message);
      return;
    }

    setHasProfile(true);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ color: "white", fontSize: "18px" }}>Loading...</div>
      </div>
    );
  }

  if (!authed) {
    // send them to /login, but remember where they tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated but no profile, ask for name
  if (!hasProfile) {
    return <NamePrompt onSubmit={handleNameSubmit} />;
  }

  return children;
}
