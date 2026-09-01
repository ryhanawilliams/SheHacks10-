import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ MISSING SUPABASE CREDENTIALS!");
  console.error("📝 Create a .env file in the project root with:");
  console.error("   VITE_SUPABASE_URL=your_supabase_url");
  console.error("   VITE_SUPABASE_ANON_KEY=your_anon_key");
  console.error(
    "🔗 Get these from: https://app.supabase.com (Project Settings > API)"
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
