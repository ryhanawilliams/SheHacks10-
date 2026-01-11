import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import HeartUnliked from "../assets/Heart.png";
import HeartLiked from "../assets/Heart2.png";

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
    <button
      onClick={toggle}
      className="transition-transform hover:scale-110"
      aria-label={liked ? "Unlike" : "Like"}
    >
      <img
        src={liked ? HeartLiked : HeartUnliked}
        alt={liked ? "Liked" : "Unliked"}
        className="w-6 h-6 object-contain"
      />
    </button>
  );
}
