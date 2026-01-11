import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { ITEMS } from "../data/items.jsx";

export default function LikedTutorials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get all liked tutorial IDs for this user
        const { data, error } = await supabase
          .from("likes")
          .select("tutorial_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching likes:", error);
          setLoading(false);
          return;
        }

        const likedIds = (data ?? []).map((like) => like.tutorial_id);
        console.log("Liked tutorial IDs:", likedIds);

        if (likedIds.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        const allTutorials = [];

        // 1. Get hardcoded tutorials that are liked
        const hardcodedLiked = ITEMS.filter((item) =>
          likedIds.includes(item.id)
        );
        allTutorials.push(...hardcodedLiked);

        // 2. Get generated tutorials from database
        // Filter out IDs that are already in hardcoded items
        const hardcodedIds = ITEMS.map((item) => item.id);
        const generatedIds = likedIds.filter(
          (id) => !hardcodedIds.includes(id)
        );

        if (generatedIds.length > 0) {
          const { data: dbTutorials, error: tutError } = await supabase
            .from("tutorials")
            .select("*")
            .in("id", generatedIds);

          if (tutError) {
            console.error("Error fetching generated tutorials:", tutError);
          } else if (dbTutorials) {
            // Transform database tutorials to match the format
            const formattedDbTutorials = dbTutorials.map((tut) => ({
              id: tut.id,
              title: tut.title,
              src: tut.image_url,
              category: "Generated",
              liked: true,
              tutorial: tut.tutorial,
            }));
            allTutorials.push(...formattedDbTutorials);
          }
        }

        console.log("All liked tutorials:", allTutorials);
        setItems(allTutorials);
      } catch (err) {
        console.error("Unexpected error loading liked tutorials:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "white",
              margin: "0 0 10px 0",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            ❤️ Liked Tutorials
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.9)",
              margin: "0",
            }}
          >
            Your collection of favorite upcycling projects
          </p>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            color: "white",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "30px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "translateX(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ← Back to Home
        </Link>

        {/* Tutorials Grid */}
        {items.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "60px 40px",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>💔</div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#1a202c",
                margin: "0 0 10px 0",
              }}
            >
              No liked tutorials yet
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#718096",
                margin: "0 0 30px 0",
              }}
            >
              Start exploring and like your favorite tutorials!
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              Browse Tutorials
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {items.map((tutorial) => (
              <Link
                key={tutorial.id}
                to={`/tutorial/${tutorial.id}`}
                style={{
                  textDecoration: "none",
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: "100%",
                    height: "220px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={tutorial.src}
                    alt={tutorial.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Category Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(102, 126, 234, 0.95)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {tutorial.category}
                  </div>
                  {/* Like Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(255, 255, 255, 0.95)",
                      padding: "8px",
                      borderRadius: "50%",
                      fontSize: "18px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    ❤️
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1a202c",
                      margin: "0 0 8px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {tutorial.title}
                  </h3>
                  {tutorial.tutorial?.meta?.readTime && (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#718096",
                        margin: "0",
                      }}
                    >
                      ⏱️ {tutorial.tutorial.meta.readTime}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
