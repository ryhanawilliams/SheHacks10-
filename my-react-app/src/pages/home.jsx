import React, { useState } from "react";
import BentoGrid from "../components/bento.jsx";
import Search from "../components/search.jsx";
import Upload from "../components/upload.jsx";
import { Link } from "react-router-dom";
import { ITEMS, CATEGORIES } from "../data/items.jsx";

export default function Home() {
  const [items, setItems] = useState(ITEMS);

  function toggleLike(id) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, liked: !x.liked } : x))
    );
  }

  return (
    <>
      <div className="flex flex-row w-full h-full">
        <div className="w-[5%] h-full border-r-2 border-gray-300 flex items-center justify-center">
          {/* Left panel: 5% width */}
        </div>
        <div className="w-[95%] h-full flex flex-col items-center overflow-y-auto">
          <div className="w-[90%] h-20 flex flex-row my-8">
            <div className="w-[90%] h-full">
              <Search />
            </div>
            <div className="w-[10%] h-full flex items-center justify-end mr-4">
              <div className="flex flex-end items-center space-x-2">
                <Link to="/user">
                  <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer"></div>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-[90%] h-[30%] mb-8 border-2 border-gray-300 shadow-lg rounded-3xl">
            <Upload />
          </div>
          <div className="w-[90%] h-[80%]">
            <BentoGrid
              items={items}
              categories={CATEGORIES}
              onToggleLike={toggleLike}
            />
          </div>
        </div>
      </div>
    </>
  );
}
