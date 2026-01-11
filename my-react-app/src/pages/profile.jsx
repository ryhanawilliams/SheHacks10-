import React from "react";
import { Link } from "react-router-dom";
import pfpImage from "/avatar.jpeg";

export default function Home() {
  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-[5%] h-full border-r-2 border-gray-300 flex flex-col items-center justify-start py-12 gap-12">
        <img src="/circl.png" alt="logo" className="w-8 h-8" />
        <Link to="/">
          <img
            src="/Icon.png"
            alt="Home"
            className="w-8 h-8 hover:cursor-pointer hover:opacity-90 duration-500"
          />
        </Link>
        <Link to="/user">
          <img
            src="/Heart4.png"
            alt="likes"
            className="w-8 h-8 hover:cursor-pointer hover:opacity-90 duration-500"
          />
        </Link>
      </div>
      <div className="w-[95%] h-full flex flex-col items-center overflow-y-auto bg-[#f5f5f5]">
        <div className="flex flex-col items-center justify-center pt-16 mt-16">
          <img
            src={pfpImage}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover mb-6"
          />
          <h1 className="text-3xl font-bold text-black mb-1">Your Name Here</h1>
          <p className="text-gray-500 text-xl">@username</p>
        </div>
      </div>
    </div>
  );
}
