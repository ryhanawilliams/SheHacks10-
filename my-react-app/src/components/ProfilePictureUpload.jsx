import React, { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import defaultPfp from "../assets/pfp.png";

/**
 * ProfilePictureUpload Component
 *
 * Displays user's profile picture with upload/change functionality
 * - Shows default pfp.png if no custom avatar
 * - Allows clicking to upload new picture
 * - Uploads to Supabase Storage
 * - Updates database with new avatar URL
 */
export default function ProfilePictureUpload({
  currentAvatarUrl,
  userId,
  onUploadComplete,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get the display URL - use custom avatar if exists, otherwise default
  const displayUrl = currentAvatarUrl || defaultPfp;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        try {
          // Extract file path from URL
          const oldPath = currentAvatarUrl.split("/avatars/")[1];
          if (oldPath) {
            await supabase.storage.from("avatars").remove([oldPath]);
          }
        } catch (err) {
          console.warn("Could not delete old avatar:", err);
        }
      }

      setUploadProgress(30);

      // Upload new avatar to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(60);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      setUploadProgress(80);

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      setUploadProgress(100);

      // Call the callback to refresh profile data
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }

      // Show success message briefly
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Error uploading avatar:", error);

      if (error.message?.includes("new row violates row-level security")) {
        alert(
          "⚠️ Avatar upload failed!\n\n" +
            "Please make sure you've run the SQL migration:\n" +
            "1. Go to Supabase Dashboard > SQL Editor\n" +
            "2. Run the SUPABASE_AVATAR_MIGRATION.sql file\n\n" +
            "This sets up the storage bucket and permissions."
        );
      } else if (
        error.message?.includes("avatars") &&
        error.message?.includes("not found")
      ) {
        alert(
          "⚠️ Storage bucket 'avatars' not found!\n\n" +
            "Please run the SUPABASE_AVATAR_MIGRATION.sql in your Supabase dashboard."
        );
      } else {
        alert("Error uploading avatar: " + error.message);
      }

      setUploading(false);
      setUploadProgress(0);
    }

    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={handleImageClick}
        className="relative group cursor-pointer"
        title="Click to change profile picture"
      >
        <img
          src={displayUrl}
          alt="Profile"
          className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 transition-all duration-300 group-hover:border-purple-500"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-semibold">Change Photo</span>
          </div>
        </div>

        {/* Upload progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 rounded-full border-4 border-white border-t-transparent animate-spin mb-2" />
              <span className="text-sm font-semibold">{uploadProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Small edit badge */}
      <div className="absolute bottom-2 right-2 bg-purple-500 rounded-full p-2 shadow-lg border-2 border-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    </div>
  );
}
