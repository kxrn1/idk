# Discord Username Collector

A secure, two-tier web application that creates a modal popup to collect a user's Discord username and forwards it to a Discord webhook **without exposing the webhook URL on the client side**.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Deploy to Vercel](#quick-deploy-to-vercel)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Embedding in Your Website](#embedding-in-your-website)
- [Customization](#customization)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Frontend (embed.js)
- **Drop-in JavaScript** - Single `<script>` tag integration
- **No Dependencies** - Pure vanilla JavaScript, works everywhere
- **Dynamic CSS Injection** - No external stylesheet required
- **Modern UI** - Clean, responsive modal with backdrop blur
- **Loading States** - Visual feedback during submission
- **Error Handling** - Graceful error messages for network issues
- **Session Memory** - Won't show again after successful submission

### Backend (server.js)
- **Secure Proxy** - Webhook URL never exposed to client
- **CORS Protection** - Configurable origin restrictions
- **Rate Limiting** - Prevents abuse (10 requests per 15 min per IP)
- **Input Validation** - Sanitizes and validates usernames
- **Discord Embeds** - Beautiful formatted messages
- **Health Endpoint** - `/health` for monitoring

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│   User's        │      │   Your Node.js      │      │   Discord        │
│   Browser       │─────▶│   Backend Server    │─────▶│   Webhook        │
│   (embed.js)    │      │   (server.js)       │      │   API            │
└─────────────────┘      └─────────────────────┘      └──────────────────┘
       │                          │                            │
       │  1. Shows modal          │                            │
       │  2. Collects username    │                            │
       │  3. POST /api/submit     │                            │
       │     { username }         │                            │
       │                          │  4. Forwards to webhook    │
       │                          │     with Discord embed     │
       │                          │                            │
       │                          │                            │  5. Message
       │                          │                            │     appears in
       │                          │                            │     channel
       │◀──── 6. Success ─────────│◀──── 7. OK ────────────────│
       │   response               │                            │
```

**Key Security Feature:** The Discord webhook URL exists ONLY in the `.env` file on the backend server. The frontend only knows about your backend API endpoint.

---

## 📦 Prerequisites

- **Node.js** v16.x or higher
- **npm** v8.x or higher
- A **Discord Webhook URL** (get it from your Discord server settings)

---

## ⚡ Quick Deploy to Vercel

### 1. Push to GitHub

First, push your code to a GitHub repository.

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. **Add Environment Variable:**
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: Your Discord webhook URL

### 3. Deploy

Click **Deploy**. Vercel will automatically:
- Serve `embed.js` as a static file
- Run `api/submit-username.js` as a serverless function

### 4. Update Your Website

Once deployed, add this to your website:

```html
<script src="https://your-project.vercel.app/embed.js"></script>
```

No `data-api-url` needed—it will auto-detect!

---

## 📦 Installation

### 1. Clone or Download the Files

Ensure you have these files in your project directory:
```
├── server.js          # Node.js backend
├── embed.js           # Frontend modal script
├── .env               # Environment variables (webhook URL)
├── package.json       # Node.js dependencies
└── README.md          # This file
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variable management
- `axios` - HTTP client for Discord API

---

## ⚙️ Configuration

### 1. Set Up Environment Variables

The `.env` file should contain:

```env
# Discord Webhook URL - KEEP THIS SECRET
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN

# Server Configuration
PORT=3000
NODE_ENV=production

# Optional: Restrict CORS to specific domains (comma-separated)
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**⚠️ IMPORTANT:** Never commit your `.env` file to version control! Add it to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### 2. Configure CORS (Optional but Recommended)

For production, restrict which domains can call your API:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

If left unset, the server defaults to allowing all origins (`*`), which is fine for development but not recommended for production.

---

## ▶️ Running the Server

### Development Mode

```bash
npm run dev
```

This runs with auto-reload on file changes.

### Production Mode

```bash
npm start
```

### Verify Server is Running

Open your browser to:
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-01T...",
  "uptime": 12345
}
```

---

## 📤 Embedding in Your Website

### Basic Usage

Add this script tag to your HTML (before the closing `</body>` tag):

```html
<script 
  src="http://localhost:3000/path/to/embed.js" 
  data-api-url="http://localhost:3000"
></script>
```

### Production Usage

```html
<script 
  src="https://your-cdn.com/embed.js" 
  data-api-url="https://your-backend-api.com"
></script>
```

### Where to Place the Script

The modal will appear automatically when the page loads. Place the script:

1. **At the end of `<body>`** (recommended):
   ```html
   <body>
     <!-- Your website content -->
     
     <script src="embed.js" data-api-url="https://your-api.com"></script>
   </body>
   ```

2. **Or in `<head>` with defer**:
   ```html
   <head>
     <script src="embed.js" data-api-url="https://your-api.com" defer></script>
   </head>
   ```

### Hosting the embed.js File

You have two options:

**Option A: Serve from your backend**
```javascript
// Add to server.js
app.use('/embed.js', express.static('embed.js'));
```
Then use: `<script src="https://your-backend.com/embed.js" ...>`

**Option B: Host separately**
Upload `embed.js` to your CDN or web server and reference it directly.

---

## 🎨 Customization

### Changing Modal Text

Edit the `createModal()` function in `embed.js`:

```javascript
modal.innerHTML = `
  <h2 class="modal-heading">Your Custom Heading</h2>
  <p class="modal-body">Your custom message here.</p>
  ...
`;
```

### Changing Colors

Edit the `STYLES` constant in `embed.js`. Key colors:

```css
/* Discord brand color */
background: linear-gradient(135deg, #5865F2 0%, #4752c4 100%);

/* Success color */
background: linear-gradient(135deg, #57F287 0%, #3ba55c 100%);

/* Error color */
color: #ed4245;
```

### Changing Rate Limits

Edit the `limiter` configuration in `server.js`:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  ...
});
```

### Changing Discord Embed Appearance

Edit the `discordPayload` object in `server.js`:

```javascript
const discordPayload = {
  embeds: [{
    title: 'Your Custom Title',
    description: 'Your custom description',
    color: 0x5865F2, // Hex color (without #)
    fields: [...],
    ...
  }]
};
```

---

## 🔒 Security Considerations

### What's Protected ✅

- **Webhook URL** - Stored only in `.env`, never sent to client
- **Rate Limiting** - Prevents spam attacks
- **Input Validation** - Prevents injection attacks
- **CORS** - Restricts which domains can call your API
- **Payload Size Limits** - Prevents large body attacks

### What You Should Do 🔐

1. **Never commit `.env`** to version control
2. **Set `ALLOWED_ORIGINS`** in production
3. **Use HTTPS** for your backend in production
4. **Monitor your webhook** for unusual activity
5. **Consider adding authentication** if needed

### What's NOT Protected ⚠️

- If you set `ALLOWED_ORIGINS='*'`, any website can call your API
- The modal can be bypassed by sending direct requests to your API
- Rate limiting is per-IP, so sophisticated attackers can rotate IPs

---

## 🐛 Troubleshooting

### Modal Doesn't Appear

1. Check browser console for JavaScript errors
2. Verify the script is loading: check Network tab
3. Ensure `data-api-url` is set correctly
4. Check if sessionStorage is blocking (clear it)

### "Failed to Connect to Server"

1. Verify backend is running: `http://localhost:3000/health`
2. Check CORS settings in `server.js`
3. Ensure `data-api-url` matches your backend URL
4. Check browser console for CORS errors

### Webhook Not Receiving Messages

1. Verify `DISCORD_WEBHOOK_URL` in `.env` is correct
2. Check server logs for errors
3. Test webhook URL directly with curl:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"content":"test"}' \
     YOUR_WEBHOOK_URL
   ```
4. Ensure your Discord server allows webhooks

### Rate Limit Triggered Too Quickly

1. Check if you're behind a NAT (shared IP)
2. Adjust `windowMs` and `max` in `server.js`
3. Consider using a different rate limit key (e.g., session-based)

### CORS Errors in Browser

1. Set `ALLOWED_ORIGINS` in `.env` to your frontend domain
2. Ensure backend is running on the correct port
3. Check that `data-api-url` matches exactly (including http/https)

---

## 📝 API Reference

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check for monitoring |
| `/api/submit-username` | POST | Submit a Discord username |

### POST /api/submit-username

**Request Body:**
```json
{
  "username": "username#1234"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Username submitted successfully"
}
```

**Error Response (400/500/502):**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Frontend API

Access the modal programmatically:

```javascript
// Open modal manually
window.DiscordUsernameModal.open();

// Close modal manually
window.DiscordUsernameModal.close();

// Check if modal is open
window.DiscordUsernameModal.isOpen();

// Check if user has submitted
window.DiscordUsernameModal.hasSubmitted();
```

---

## 📄 License

MIT License - Feel free to use in your projects!

---

## 🤝 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review server logs for errors
3. Check browser console for client-side errors
4. Verify your Discord webhook URL is valid

---

**Built with ❤️ for secure Discord integrations**
