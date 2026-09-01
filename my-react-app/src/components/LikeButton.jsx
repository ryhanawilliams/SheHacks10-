import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LikeButton({ tutorialId }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return setLiked(false);

      const { data } = await supabase
        .from("likes")
        .select("tutorial_id")
        .eq("user_id", user.id)
        .eq("tutorial_id", tutorialId)
        .maybeSingle();

      setLiked(!!data);
    };

    check();
  }, [tutorialId]);

  const toggle = async () => {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return alert("Please log in first.");

    if (!liked) {
      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        tutorial_id: tutorialId,
      });
      if (error) return alert(error.message);
      setLiked(true);
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("tutorial_id", tutorialId);
      if (error) return alert(error.message);
      setLiked(false);
    }
  };

  return (
    <button onClick={toggle} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <img
        src={liked ? "/assets/Heart2.png" : "/assets/Heart1.png"}
        alt={liked ? "Liked" : "Like"}
        style={{ width: 18, height: 18, verticalAlign: "middle" }}
      />
      {liked ? "Liked" : "Like"}
    </button>
  );
}
