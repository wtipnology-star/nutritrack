# NutriTrack — Deploy to Vercel in 5 Minutes

## Step 1 — Create a GitHub account (if you don't have one)
1. Go to **github.com**
2. Click **Sign up** → enter email, password, username
3. Verify your email

## Step 2 — Upload the app to GitHub
1. Go to **github.com** (logged in)
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `nutritrack`
4. Set to **Private**
5. Click **Create repository**
6. On the next page, click **uploading an existing file**
7. Open the `nutritrack` folder on your computer
8. Select ALL files inside it and drag them into the GitHub upload area:
   - `package.json`
   - `vercel.json`
   - `README.md`
   - The `src/` folder (contains App.jsx, index.js)
   - The `public/` folder (contains index.html, manifest.json, sw.js, icons)
9. Click **Commit changes** (green button)

## Step 3 — Deploy on Vercel
1. Go to **vercel.com**
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access GitHub
4. Click **Add New Project**
5. Find `nutritrack` in the list → click **Import**
6. Framework Preset: select **Create React App**
7. Click **Deploy** — wait ~60 seconds ⏳
8. You'll see "Congratulations!" with your URL like:
   `https://nutritrack-waleed.vercel.app`

## Step 4 — Install on your iPhone as an app
1. Open **Safari** on your iPhone
2. Go to your Vercel URL (e.g. `nutritrack-waleed.vercel.app`)
3. Tap the **Share** button (square with arrow pointing up)
4. Scroll down → tap **Add to Home Screen**
5. Name it **NutriTrack** → tap **Add**
6. ✅ App icon appears on your home screen!

## Step 4 (Android) — Install on Android
1. Open **Chrome** on your Android
2. Go to your Vercel URL
3. Tap the **⋮ menu** (top right)
4. Tap **Add to Home Screen** → **Install**
5. ✅ App icon appears on your home screen!

## What works after installing
- ✅ Camera & photo upload (tap 📷 in Log Food)
- ✅ AI food recognition from photos
- ✅ AI Health Advisor chat
- ✅ Gym/rest day targets
- ✅ Calorie, protein & fiber tracking
- ✅ Works offline (cached after first load)
- ✅ Full screen, no browser bar

## Optional — Add Google Fit weight sync
1. Open `src/App.jsx` in GitHub (click the file → pencil icon to edit)
2. On line 4, replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your Google OAuth Client ID
3. Click **Commit changes** — Vercel auto-deploys in 60 seconds

## Need help?
Ask Claude in the chat for any step you're stuck on!
