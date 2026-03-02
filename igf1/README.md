# API Showcase

A beautiful, modern platform to showcase and share your APIs with the community.

## Features

- 🎨 **Custom UI Components** - No browser defaults, fully styled elements
- 🔒 **Secure Backend** - API keys stored securely in Vercel environment variables
- 💾 **Persistent Storage** - Uses JSONBin.io for cloud storage
- 🛡️ **XSS Protection** - All user inputs are sanitized
- 🔍 **Search Functionality** - Find APIs quickly
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast & Lightweight** - No heavy frameworks

## Setup Instructions

### 1. Create a JSONBin.io Account

1. Go to [JSONBin.io](https://jsonbin.io)
2. Sign up for a free account
3. Navigate to **API Keys** page
4. Copy your **Master Key**

### 2. Create a Bin for APIs

1. In JSONBin dashboard, click **Create Bin**
2. Name it something like `apis`
3. Copy the **Bin ID** (looks like: `6xxxxxxxxxxxxxxxxxxxxx`)

### 3. Configure Vercel Environment Variables

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `JSONBIN_MASTER_KEY` - Paste your Master Key
   - `JSONBIN_BIN_ID` - Paste your Bin ID
5. Click **Save**

### 4. Deploy

Push your changes to GitHub and Vercel will automatically deploy.

## Project Structure

```
├── api/
│   └── bin.js          # Serverless function (secure API proxy)
├── index.html          # Homepage with all APIs
├── search.html         # Search page
├── publish.html        # Publish your API form
├── script.js           # Main JavaScript
├── styles.css          # All styles
├── vercel.json         # Vercel configuration
└── .env.example        # Environment variables template
```

## Security Features

- **API Keys Never Exposed**: Keys are stored in Vercel environment variables, only accessible by serverless function
- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **URL Validation**: Image URLs are validated against allowed hosting services
- **Server-Side Validation**: All data is validated before storing in JSONBin

## Allowed Image Hosting Services

- Imgur (`i.imgur.com`, `imgur.com`)
- Unsplash (`images.unsplash.com`, `unsplash.com`)
- Picsum (`picsum.photos`)
- Pixabay (`cdn.pixabay.com`, `pixabay.com`)
- Pexels (`images.pexels.com`, `pexels.com`)
- GitHub Raw (`raw.githubusercontent.com`)

## API Categories

1. **Authentication** - Auth, security, OAuth APIs
2. **Data & Analytics** - Data processing, analytics, metrics APIs
3. **Media & Content** - Images, videos, files, content APIs

## Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev

# Open http://localhost:3000
```

## Adding Your First API

1. Click **Publish Your API**
2. Fill in the form:
   - API Name (e.g., "Weather API")
   - Description (min 10 characters)
   - Image URL (from allowed hosts)
   - Category (select from dropdown)
   - Published Date
   - Author Name
   - Endpoint (optional)
3. Click **Publish API**
4. Your API will be saved to JSONBin and visible to everyone!

## License

MIT License - Feel free to use for your projects!
