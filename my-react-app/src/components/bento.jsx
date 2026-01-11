// BentoBoard.jsx
import React, { useState } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { LAYOUT } from "../data/items.jsx";
import HeartUnliked from "../assets/Heart.png";
import HeartLiked from "../assets/Heart2.png";

function HeartIcon({ filled }) {
  return (
    <img
      src={filled ? HeartLiked : HeartUnliked}
      alt={filled ? "Liked" : "Unliked"}
      className="w-4 h-4 object-contain"
    />
  );
}

function Tabs({ categories, active, onChange }) {
  return (
    <div className="w-full mb-1">
      <div className="flex items-center justify-between px-1 pb-2 pt-1">
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={[
                "relative whitespace-nowrap text-lg font-semibold",
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700",
              ].join(" ")}
            >
              {c}
              {isActive ? (
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] w-full rounded-full bg-zinc-900" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BentoTile({ item, onToggleLike, useLayout }) {
  const placement = useLayout ? LAYOUT[item.layoutKey] ?? "" : "";
  const hasImage = Boolean(item.src);

  return (
    <Link
      to={`/tutorial/${item.id}`}
      className={[
        "group relative block overflow-hidden rounded-2xl bg-zinc-200 shadow-sm",
        "h-[160px] sm:h-[175px] md:h-full",
        placement,
      ].join(" ")}
    >
      {hasImage ? (
        <img
          src={item.src}
          alt={item.title || "Gallery item"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-zinc-100 to-zinc-300 text-[11px] font-semibold text-zinc-600">
          IMAGE
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3">
        <div className="min-h-[16px] max-w-[80%] truncate text-xs font-semibold text-white">
          {item.title}
        </div>

        <button
          type="button"
          className="transition-transform hover:scale-110"
          aria-label={item.liked ? "Unlike" : "Like"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleLike?.(item.id);
          }}
        >
          <HeartIcon filled={item.liked} />
        </button>
      </div>
    </Link>
  );
}

export default function BentoGrid({ items, categories, onToggleLike }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const visible = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((x) => x.category === activeCategory);
  }, [items, activeCategory]);

  const isShowingAll = activeCategory === "All";

  return (
    <div className="w-full">
      <Tabs
        categories={categories}
        active={activeCategory}
        onChange={(c) => setActiveCategory(c)}
      />

      <div className="rounded-2xl pt-3 pb-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[110px] md:gap-3">
          {visible.map((item) => (
            <BentoTile
              key={item.id}
              item={item}
              onToggleLike={onToggleLike}
              useLayout={isShowingAll}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
