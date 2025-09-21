# 🚀 Supabase Setup Guide for Skylers Website

This guide will help you set up Supabase so Skyler can manage the website from anywhere!

## 📋 Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub (recommended) or email
4. Create a new organization (use your name or "Skylers Website")
5. Click "New Project"

## 🗄️ Step 2: Create Project

1. **Project Name**: `skylers-website`
2. **Database Password**: Create a strong password (save this!)
3. **Region**: Choose closest to your location
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## 🗃️ Step 3: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste the entire contents of `supabase-schema.sql` 
4. Click **"Run"** to create all tables and permissions
5. You should see "Success" message

## 🔑 Step 4: Get API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like: `https://abc123.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## ⚙️ Step 5: Configure Website

1. Open `supabase-config.js` in your project
2. Replace these lines:
   ```javascript
   url: 'https://your-project-ref.supabase.co',  // Replace with your Project URL
   anonKey: 'your-anon-key-here',                // Replace with your anon key
   ```

## ✅ Step 6: Test the System

1. Save all files and commit to GitHub
2. Visit your live website
3. Wait 3 seconds for crown button to appear
4. Login with: `skyler` / `canine2024`
5. Try adding a blog post - it should save to Supabase!

## 🎯 What This Enables

Once set up, Skyler can:
- ✅ **Add blog posts** from anywhere in the world
- ✅ **Edit all website content** in real-time
- ✅ **Upload new photos** for any section
- ✅ **See changes instantly** on the live website
- ✅ **Access from any device** with internet connection

## 🔒 Security Features

- **Public read access** - Anyone can view content
- **Owner-only editing** - Only Skyler can make changes
- **Automatic backups** - All changes saved in database
- **Session management** - 24-hour login sessions

## 🆘 Troubleshooting

**If the crown button doesn't appear:**
- Check browser console for errors
- Verify Supabase URL and key are correct
- Make sure you've run the SQL schema

**If changes don't save:**
- Check internet connection
- Verify Supabase project is active
- Check browser console for API errors

**If you can't login:**
- Username: `skyler`
- Password: `canine2024`
- Make sure you're typing exactly (case-sensitive)

## 📞 Need Help?

The system includes automatic fallback to localStorage, so the website will still work even if Supabase has issues. All changes will sync to the database once connection is restored.

---

**🎉 Once set up, Skyler will have full control over the website from anywhere!**
