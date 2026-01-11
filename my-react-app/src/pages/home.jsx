import React, { useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  function toggleLike(id) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, liked: !x.liked } : x))
    );
  }

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter items based on debounced search query
  const filteredItems = ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const hasSearchResults =
    debouncedSearch.trim() !== "" && filteredItems.length > 0;
  const hasNoSearchResults =
    debouncedSearch.trim() !== "" && filteredItems.length === 0;

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
      const errorMsg =
        error.message ||
        "Failed to analyze image. Make sure the backend server is running on port 4000.";
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
            <Search value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="w-[10%] h-full flex items-center justify-end mr-4">
            <div className="flex flex-end items-center space-x-2">
              <Link to="/user">
                <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {hasSearchResults && (
          <div className="w-[90%] mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border-2 border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {hasNoSearchResults && (
          <div className="w-[90%] mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="border-2 border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <p className="text-gray-600 text-lg">
                No matches found for "{debouncedSearch}"
              </p>
            </div>
          </div>
        )}

        {/* Upload card */}
        <div className="w-[90%] h-[90%] mb-12 border-2 border-gray-300 shadow-lg rounded-3xl flex justify-center">
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
        <div className="w-[90%] h-[80%] mb-8">
          <BentoGrid
            items={items}
            categories={CATEGORIES}
            onToggleLike={toggleLike}
          />
        </div>
      </div>
    </div>
  );
}
