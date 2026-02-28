# PhoneSint 🔒

**Secure Phone Intelligence Service**

A professional-grade phone number lookup service with carrier detection, location estimation, and device profiling. Built with security-first principles and designed for Vercel deployment.

---

## 🔐 Security Features

- **Helmet.js** - Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting** - 100 requests/15min general, 20 lookups/15min per IP
- **Input Validation** - Strict E.164 phone number format validation
- **CORS Protection** - Configurable allowed origins
- **Request Size Limits** - 10kb max payload
- **Environment Variables** - API keys never hardcoded in production
- **Graceful Shutdown** - Proper signal handling for clean deployments

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- [apilayer](https://apilayer.com/) API key (free tier available)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your NUMVERIFY_API_KEY

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `NUMVERIFY_API_KEY` | Your apilayer API key | No* |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | No |

*Without an API key, the service runs in simulation mode.

---

## 📡 API Endpoints

### GET `/api/phone-info/:number`

Lookup phone number information.

**Parameters:**
- `number` - Phone number in E.164 format (e.g., `+14155552671`)

**Response:**
```json
{
  "inputNumber": "+14155552671",
  "owner": {
    "fullName": "John Smith",
    "disclaimer": "Owner name is simulated for demonstration purposes"
  },
  "phoneDetails": {
    "country": "United States",
    "countryCode": "US",
    "location": { "city": "New York", "region": "NY" },
    "carrier": "Verizon",
    "lineType": "mobile"
  },
  "device": {
    "type": "Smartphone",
    "brand": "Apple",
    "model": "iPhone 15 Pro",
    "os": "iOS 17.2"
  },
  "credits": {
    "idea": "Ytx12",
    "coding": "terror._1",
    "website": "qvfear"
  }
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "PhoneSint",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 🌐 Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Configure Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure environment variables:
   - `NUMVERIFY_API_KEY` - Your apilayer API key
   - `ALLOWED_ORIGINS` - Your production domain(s)

### 3. Deploy

Click **Deploy**. Vercel will automatically build and deploy your application.

### 4. Post-Deployment

- Update `ALLOWED_ORIGINS` to include your Vercel domain
- Monitor API usage in your apilayer dashboard
- Consider setting up custom domain in Vercel

---

## 🛡️ Security Best Practices

### API Key Management

```bash
# ✅ DO: Use environment variables
NUMVERIFY_API_KEY=your_key_here

# ❌ DON'T: Hardcode in source files
const apiKey = "c58c02ea5f525ddc77482ae827496f71"; // NEVER DO THIS
```

### .gitignore

Ensure `.env` is in your `.gitignore`:

```
.env
.env.local
.env.*.local
```

### CORS Configuration

For production, restrict origins:

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Rate Limiting

Default limits are configured in `server.js`. Adjust based on your needs:

```javascript
// General API limit
max: 100, // requests per 15 minutes

// Phone lookup limit (stricter)
max: 20, // lookups per 15 minutes
```

---

## 🎨 UI Features

- **Modern Dark Theme** - Professional emerald green & slate color palette
- **Inter Font** - Clean, readable typography
- **Phosphor Icons** - Consistent, professional iconography
- **Responsive Design** - Mobile-first, works on all devices
- **Loading States** - Smooth animations and feedback
- **Error Handling** - Clear, user-friendly error messages

---

## 📁 Project Structure

```
phonesint/
├── server.js           # Express server with security middleware
├── public/
│   └── index.html      # Frontend UI
├── package.json        # Dependencies and scripts
├── vercel.json         # Vercel deployment configuration
├── .env.example        # Environment template
├── .env                # Local environment (gitignored)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 📝 Credits

- **Idea:** Ytx12
- **Coding:** terror._1
- **Website:** qvfear

---

## ⚠️ Disclaimer

This service provides **simulated owner information** for demonstration purposes only. Real owner data requires access to private, paid databases and is not available through this free service.

Carrier and country information is fetched from the [apilayer](https://apilayer.com/) API when a valid API key is configured.

---

## 📄 License

ISC

---

## 🔗 Links

- [apilayer Documentation](https://apilayer.com/marketplace/number_verification-api)
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
