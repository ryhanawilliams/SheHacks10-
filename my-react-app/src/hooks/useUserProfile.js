import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Custom hook to get the current user's profile information
 * Returns: { profile, loading, error, refetch, userId }
 *
 * Profile object includes:
 * - id: user ID
 * - name: display name
 * - avatar_url: profile picture URL (null if using default)
 * - created_at, updated_at: timestamps
 */
export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setProfile(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        // If table doesn't exist, silently skip (not a critical error)
        if (
          profileError.message.includes("does not exist") ||
          profileError.message.includes("Could not find")
        ) {
          console.warn("⚠️ Profiles table doesn't exist yet");
          setProfile(null);
        } else {
          throw profileError;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchProfileSafe = async () => {
      if (!mounted) return;
      await fetchProfile();
    };

    fetchProfileSafe();

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        fetchProfileSafe();
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return { profile, loading, error, refetch: fetchProfile, userId };
}
