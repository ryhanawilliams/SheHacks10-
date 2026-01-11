# Profile Picture / Avatar Setup Guide

## Overview

Your app now supports custom profile pictures with the following features:

- ✅ Default profile picture (`pfp.png`) for all users
- ✅ Users can upload custom profile pictures
- ✅ Images stored securely in Supabase Storage
- ✅ Profile pictures displayed throughout the app (home, profile pages)
- ✅ Click-to-upload functionality on profile page
- ✅ Automatic image optimization and validation

## Setup Instructions

### Step 1: Run Database Migration

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy the contents of `SUPABASE_AVATAR_MIGRATION.sql`
5. Paste into the SQL editor
6. Click **"Run"** or press `Ctrl+Enter`

This will:

- Add `avatar_url` column to your `profiles` table
- Create an `avatars` storage bucket
- Set up storage policies for secure uploads

### Step 2: Verify Storage Setup

1. Go to **Storage** in your Supabase Dashboard
2. You should see a new bucket called **"avatars"**
3. The bucket should be set to **Public** (for viewing avatars)

### Step 3: Test the Feature

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to your profile page
3. Click on the profile picture
4. Upload an image (JPEG, PNG, etc. - max 5MB)
5. The image should upload and display immediately
6. Check that the new image appears on the home page avatar too

## How It Works

### Profile Picture Component (`ProfilePictureUpload.jsx`)

- Shows default `pfp.png` if user hasn't uploaded a custom picture
- Hover effect shows "Change Photo" overlay
- Click to trigger file picker
- Validates file type and size
- Uploads to Supabase Storage in user-specific folder (`userId/avatar-*.jpg`)
- Updates `profiles.avatar_url` in database
- Deletes old avatar on new upload

### User Profile Hook (`useUserProfile.js`)

- Fetches user profile including `avatar_url`
- Returns `userId` for upload component
- Provides `refetch()` function to reload profile after upload

### Where Avatars Are Used

- **Profile Page** (`profile.jsx`): Large avatar with upload functionality
- **Home Page** (`home.jsx`): Small avatar in top-right corner
- **Default**: Falls back to `pfp.png` if no custom avatar set

## File Structure

```
src/
├── assets/
│   └── pfp.png                          # Default profile picture
├── components/
│   └── ProfilePictureUpload.jsx         # Upload component
├── hooks/
│   └── useUserProfile.js                # Profile data hook
└── pages/
    ├── profile.jsx                      # Profile page with avatar
    └── home.jsx                         # Home page with avatar

Database:
└── profiles
    ├── id (uuid)
    ├── name (text)
    └── avatar_url (text)                # ← New column!

Storage:
└── avatars/
    └── {userId}/
        └── avatar-{timestamp}.jpg       # User's uploaded images
```

## Storage Structure

Avatars are stored in Supabase Storage with this structure:

```
avatars/
├── user-id-1/
│   └── avatar-1704123456789.jpg
├── user-id-2/
│   └── avatar-1704123456790.png
└── ...
```

Each user has their own folder (using their user ID) for security.

## Security Policies

The migration sets up these storage policies:

- **Upload**: Users can only upload to their own folder (`{userId}/`)
- **Update**: Users can only update their own avatars
- **Delete**: Users can only delete their own avatars
- **View**: Anyone can view all avatars (public bucket)

## Troubleshooting

### Error: "Storage bucket 'avatars' not found"

**Solution**: Run the SQL migration in Step 1

### Error: "Row-level security policy violation"

**Solution**: Make sure the storage policies were created (check the migration)

### Avatar not showing

**Solution**:

1. Check browser console for errors
2. Verify the `avatar_url` in your database
3. Make sure the Storage bucket is set to **Public**
4. Try uploading a new image

### Image too large

**Solution**: The component limits images to 5MB. Compress your image or choose a smaller one.

## Features to Add (Optional)

Want to enhance this further? Consider:

- Image cropping before upload
- Multiple aspect ratios
- Avatar library/preset avatars
- Image filters/effects
- Thumbnail generation for performance

## Support

If you run into issues:

1. Check the browser console for errors
2. Check the Supabase Dashboard > Logs
3. Verify all steps in this guide were completed
4. Make sure you're on the latest code

---

**All set!** Your users can now personalize their profiles with custom avatars. 🎉
