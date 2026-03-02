# Discord Verification System

A secure Discord ID verification system that validates users against Discord's API before allowing access to your website. Features real-time ID validation, VPN/Tor detection, and detailed webhook notifications.

## 📋 Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Prerequisites](#prerequisites)
- [Quick Deploy to Vercel](#quick-deploy-to-vercel)
- [Local Installation](#local-installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Verification System
- **Real-time Discord ID Validation** - Validates IDs against Discord API before submission
- **Anti-Bypass Protection** - Blocks devtools, right-click, and common bypass methods
- **Session Memory** - Won't show again after successful verification
- **Custom Scrollbars** - Visible on all browsers including Firefox

### User Info Display
- **Bot Detection** - Shows if account is a bot
- **Banner Display** - Links to user's profile banner
- **Badges** - Shows all Discord badges/flags
- **Account Age** - Displays when account was created

### Security & Analytics
- **VPN/Tor Detection** - Identifies users with VPN, Tor, or proxy
- **IP Geolocation** - Shows location, ISP, timezone
- **Rate Limiting** - 10 requests per 15 minutes per IP
- **CORS Protection** - Configurable origin restrictions

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│   User's        │      │   Vercel/Node.js    │      │   Discord        │
│   Browser       │─────▶│   Backend Server    │─────▶│   Webhook        │
│   (embed.js)    │      │   (API Routes)      │      │   API            │
└─────────────────┘      └─────────────────────┘      └──────────────────┘
       │                          │                            │
       │  1. Shows modal          │                            │
       │  2. Enters Discord ID    │                            │
       │  3. POST /validate       │                            │
       │     { userId }           │                            │
       │◀──── Validate with Discord API ───────────────────────│
       │                          │                            │
       │  4. ID Valid - Enable button                          │
       │  5. POST /submit         │                            │
       │     { userId, user }     │                            │
       │                          │  6. Forwards to webhook    │
       │                          │     with full embed        │
       │                          │                            │
       │                          │                            │  7. Message
       │                          │                            │     appears in
       │                          │                            │     channel
       │◀──── Success ────────────│◀──── OK ───────────────────│
```

---

## 📦 Prerequisites

- **Node.js** v20.x or higher
- **npm** v8.x or higher
- A **Discord Server** with webhook permissions
- A **Discord Bot** (for ID validation)

---

## ⚡ Quick Deploy to Vercel

### Step 1: Get Discord Webhook URL

1. Open your Discord server
2. Go to **Server Settings** > **Integrations** > **Webhooks**
3. Click **New Webhook**
4. Choose a channel and copy the webhook URL

### Step 2: Create Discord Bot & Get Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** and give it a name
3. Go to **Bot** tab > **Reset Token** > Copy the token
4. Enable these **Privileged Gateway Intents**:
   - Server Members Intent (optional)
   - Message Content Intent (optional)
5. Go to **OAuth2** > Copy your Application ID (for bot invite)

### Step 3: Deploy to Vercel

1. Fork/clone this repository to your GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New Project**
4. Import your GitHub repository
5. **Add Environment Variables:**

| Variable | Value |
|----------|-------|
| `DISCORD_WEBHOOK_URL` | Your Discord webhook URL |
| `DISCORD_BOT_TOKEN` | Your Discord bot token |

6. Click **Deploy**

### Step 4: Add to Your Website

Once deployed, add this script before `</body>`:

```html
<script
  src="https://your-project.vercel.app/embed.js"
  data-api-url="https://your-project.vercel.app"
></script>
```

---

## 📦 Local Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd usersend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
PORT=3000
NODE_ENV=development
```

### 4. Run the Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

### 5. Test Locally

Open `http://localhost:3000` in your browser (you'll need to create a test HTML file that includes embed.js).

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_WEBHOOK_URL` | ✅ Yes | Discord webhook URL for notifications |
| `DISCORD_BOT_TOKEN` | ✅ Yes | Discord bot token for ID validation |
| `PORT` | ❌ No | Server port (default: 3000) |
| `NODE_ENV` | ❌ No | Environment (default: production) |
| `ALLOWED_ORIGINS` | ❌ No | Comma-separated allowed domains for CORS |

### Vercel Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** > **Environment Variables**
2. Add each variable:
   - `DISCORD_WEBHOOK_URL` (Production)
   - `DISCORD_BOT_TOKEN` (Production)
3. Redeploy your project

---

## 📤 Usage

### Basic Integration

Add to your HTML before `</body>`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
</head>
<body>
  <!-- Your website content -->

  <!-- Discord Verification Modal -->
  <script
    src="https://your-project.vercel.app/embed.js"
    data-api-url="https://your-project.vercel.app"
  ></script>
</body>
</html>
```

### Manual Control

```javascript
// Open modal manually
window.DiscordVerifyModal.open();

// Close modal manually
window.DiscordVerifyModal.close();

// Check if modal is open
window.DiscordVerifyModal.isOpen();

// Check if user has verified
window.DiscordVerifyModal.hasSubmitted();
```

### Check Verification Status

```javascript
// On page load, check if already verified
if (localStorage.getItem('discord_verified') === 'true') {
  // User already verified, grant access
  console.log('User is verified');
} else {
  // Show verification modal
  window.DiscordVerifyModal.open();
}
```

---

## 🔌 API Reference

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/validate-discord-id` | POST | Validate a Discord ID |
| `/api/submit-username` | POST | Submit verified user info |
| `/health` | GET | Health check |

### POST /api/validate-discord-id

Validates a Discord ID against Discord's API.

**Request:**
```json
{
  "userId": "1326206060020629577"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "username": "username",
    "discriminator": "0",
    "global_name": "Display Name",
    "id": "1326206060020629577",
    "display": "Display Name",
    "avatar": "https://...",
    "bot": false,
    "badges": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "banner": "https://..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid Discord ID. Please check the guide below!"
}
```

### POST /api/submit-username

Submit verified user information.

**Request:**
```json
{
  "userId": "1326206060020629577",
  "validatedUser": {
    "username": "username",
    "display": "Display Name",
    "id": "1326206060020629577",
    "avatar": "https://...",
    "bot": false,
    "badges": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "banner": "https://..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Username submitted successfully"
}
```

---

## 🔒 Security

### What's Protected

- ✅ **Webhook URL** - Never exposed to client
- ✅ **Bot Token** - Server-side only
- ✅ **Rate Limiting** - 10 req/15min per IP
- ✅ **CORS** - Configurable origin restrictions
- ✅ **Input Validation** - Discord ID format validation
- ✅ **Real-time Validation** - Prevents fake IDs

### What You Should Do

1. **Never commit `.env`** to version control
2. **Set `ALLOWED_ORIGINS`** in production
3. **Use HTTPS** in production
4. **Monitor webhook** for unusual activity
5. **Rotate bot token** if compromised

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/validate-discord-id` | 10 requests | 15 minutes |
| `/api/submit-username` | 10 requests | 15 minutes |

---

## 🐛 Troubleshooting

### Modal Doesn't Appear

1. Check browser console for errors
2. Verify script is loading (Network tab)
3. Clear `localStorage.getItem('discord_verified')`
4. Check `data-api-url` is correct

### "Invalid Discord ID"

1. Ensure Developer Mode is ON in Discord
2. Right-click your name > Copy ID
3. ID must be 17-20 digits
4. Check bot token is valid

### "Failed to forward to Discord"

1. Check webhook URL is valid
2. Verify webhook has permission to send messages
3. Check Vercel function logs for details
4. Test webhook with curl:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"content":"test"}' \
     "YOUR_WEBHOOK_URL"
   ```

### CORS Errors

1. Set `ALLOWED_ORIGINS` in Vercel environment variables
2. Ensure frontend domain matches exactly
3. Include both http and https if testing locally

### Rate Limit Triggered

1. Wait 15 minutes for limit to reset
2. Reduce test frequency
3. Use different IP/network for testing

---

## 📁 File Structure

```
usersend/
├── api/
│   ├── submit-username.js    # Webhook submission endpoint
│   └── validate-discord-id.js # Discord ID validation endpoint
├── embed.js                   # Frontend modal script
├── server.js                  # Local development server
├── package.json               # Dependencies
├── vercel.json                # Vercel configuration
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 📄 License

MIT License - Free to use in your projects.

---

## 🤝 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Vercel Function logs
3. Check browser console for client-side errors
4. Verify Discord webhook and bot token are valid

---

**Built with ❤️ for secure Discord verification**
