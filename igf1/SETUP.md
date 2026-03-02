# 🚀 Quick Setup Guide

## Step 1: Create JSONBin.io Account

1. Go to **https://jsonbin.io**
2. Click **Sign Up** (use Google/GitHub for quick signup)
3. Verify your email

## Step 2: Get Your API Key

1. After logging in, go to **API Keys** page
2. You'll see your **Master Key** (starts with `$2a$`)
3. Click the copy button to copy it

## Step 3: Create Your First Bin

1. Go to **Dashboard** or **Bins** page
2. Click **Create Bin**
3. Set **Bin Name**: `apis`
4. Set **Privacy**: Public (so anyone can read)
5. Click **Create**
6. Copy the **Bin ID** (looks like: `65f3a2b4c7d8e9f0a1b2c3d4`)

## Step 4: Add Environment Variables to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click on your project (igf1)
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar
5. Click **Add New**
6. Add these two variables:

### Variable 1:
- **Key**: `JSONBIN_MASTER_KEY`
- **Value**: (paste your Master Key from Step 2)
- **Environments**: Check all (Preview, Production, Development)
- Click **Save**

### Variable 2:
- **Key**: `JSONBIN_BIN_ID`
- **Value**: (paste your Bin ID from Step 3)
- **Environments**: Check all
- Click **Save**

## Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger auto-deploy

## Step 6: Test It!

1. Go to your site: **https://igf1.vercel.app**
2. Click **Publish Your API**
3. Fill in the form with test data:
   - Name: `Test API`
   - Description: `This is a test API to verify everything works`
   - Image: `https://picsum.photos/seed/test/400/225`
   - Category: Select any
   - Date: Today's date
   - Author: Your name
4. Click **Publish API**
5. You should be redirected to homepage with your new API!

## Troubleshooting

### "Server configuration error"
- You haven't added the environment variables to Vercel
- Go back to Step 4

### "Failed to publish API"
- Check your JSONBin Master Key is correct
- Make sure the Bin ID is correct
- Check Vercel function logs: **Vercel Dashboard** → **Functions** → **bin.js**

### APIs not showing
- The JSONBin might be empty - publish your first API
- Or the bin might have non-array data - create a new bin

## Need Help?

Check the full README.md for more details!
