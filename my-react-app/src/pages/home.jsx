import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BentoGrid from "../components/bento.jsx";
import Search from "../components/search.jsx";
import Upload from "../components/upload.jsx";
import QrUploadModal from "../components/QrUploadModal.jsx";
import { ITEMS, CATEGORIES } from "../data/items.jsx";
import { analyzeTrashImage, fileToDataUrl } from "../lib/analyzeTrashImage";

export default function Home() {
  const [items, setItems] = useState(ITEMS);
  const [qrOpen, setQrOpen] = useState(false);
  const navigate = useNavigate();

  function toggleLike(id) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, liked: !x.liked } : x)));
  }

  async function handleContinue(file) {
    try {
      // clear old idea history for new upload
      sessionStorage.removeItem("upcycling_ideas");

      const analysis = await analyzeTrashImage(file);
      const preview = await fileToDataUrl(file);

      sessionStorage.setItem("trash_analysis", JSON.stringify(analysis));
      sessionStorage.setItem("trash_preview", preview);

      navigate("/results");
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorMsg = error.message || "Failed to analyze image. Make sure the backend server is running on port 4000.";
      alert(`Error: ${errorMsg}`);
    }
  }

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-[5%] h-full border-r-2 border-gray-300 flex items-center justify-center" />

      <div className="w-[95%] h-full flex flex-col items-center overflow-y-auto">
        {/* Top bar */}
        <div className="w-[90%] h-20 flex flex-row my-8">
          <div className="w-[90%] h-full">
            <Search />
          </div>

          <div className="w-[10%] h-full flex items-center justify-end mr-4">
            <div className="flex flex-end items-center space-x-2">
              <Link to="/user">
                <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>

        {/* Upload card */}
        <div className="w-[90%] h-[30%] mb-8 border-2 border-gray-300 shadow-lg rounded-3xl">
          <Upload
            multiple={false}
            maxFiles={1}
            accept="image/*"
            onContinue={handleContinue}
            onTakePhoto={() => setQrOpen(true)}
          />
        </div>

        {/* QR Modal (not inside the upload card) */}
        <QrUploadModal
          isOpen={qrOpen}
          onClose={() => setQrOpen(false)}
          onFileReady={(file) => handleContinue(file)}
        />

        {/* Grid */}
        <div className="w-[90%] h-[80%]">
          <BentoGrid items={items} categories={CATEGORIES} onToggleLike={toggleLike} />
        </div>
      </div>
    </div>
  );
}