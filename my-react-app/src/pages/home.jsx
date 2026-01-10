import React from "react";
import BentoGrid from "../components/bento.jsx";
import Search from "../components/search.jsx";
import Upload from "../components/upload.jsx";
export default function Home() {
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
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-[90%] h-[30%] mb-8">
            <Upload />
          </div>
          <div className="w-[90%] h-[80%]">
            <BentoGrid />
          </div>
        </div>
      </div>
    </>
  );
}
