require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

// Additional security headers
app.use((req, res, next) => {
  // X-Frame-Options: Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Content Security Policy: Frame Ancestors + Script/Style sources
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:;");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection (legacy but still useful)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// URL Restriction - Only allow access from https://phonesint.vercel.app/
const ALLOWED_HOST = 'phonesint.vercel.app';

app.use((req, res, next) => {
  const host = req.get('host') || req.hostname;

  // Check if request is from allowed host
  if (host !== ALLOWED_HOST) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'This service is only available at https://phonesint.vercel.app/'
    });
  }

  next();
});

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://phonesint.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from the specific URL
    const allowedOrigin = 'https://phonesint.vercel.app';
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: false,
  methods: ['GET', 'HEAD', 'OPTIONS'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API Configuration
const NUMVERIFY_BASE_URL = 'https://apilayer.net/api/validate';

function parseApiKeys() {
  const envKeys = process.env.NUMVERIFY_API_KEY || '';
  if (!envKeys || envKeys === 'YOUR_API_KEY_HERE') return [];
  return envKeys.split(',').map(key => key.trim()).filter(key => key.length >= 32);
}

const API_KEYS = parseApiKeys();
let currentKeyIndex = 0;

function getNextApiKey() {
  if (API_KEYS.length === 0) return null;
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

if (API_KEYS.length === 0) {
  console.warn('⚠️  No API keys configured. Running in simulation mode.');
} else {
  console.log(`✓ Loaded ${API_KEYS.length} API key(s)`);
}

// Simulation functions
function getSimulatedOwnerName() {
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function getSimulatedDeviceInfo() {
  const devices = [
    { type: 'Smartphone', brand: 'Apple', model: 'iPhone 15 Pro', os: 'iOS 17.2' },
    { type: 'Smartphone', brand: 'Samsung', model: 'Galaxy S24 Ultra', os: 'Android 14' },
    { type: 'Smartphone', brand: 'Google', model: 'Pixel 8 Pro', os: 'Android 14' },
    { type: 'Feature Phone', brand: 'Nokia', model: '225 4G', os: 'Series 30+' },
    { type: 'Smartphone', brand: 'OnePlus', model: '12', os: 'OxygenOS 14' },
    { type: 'Smartphone', brand: 'Xiaomi', model: '14 Pro', os: 'HyperOS 1.0' },
  ];
  return devices[Math.floor(Math.random() * devices.length)];
}

function getEstimatedLocation(carrierName, countryCode) {
  const locations = {
    'Verizon': { city: 'New York', region: 'NY' },
    'AT&T': { city: 'Dallas', region: 'TX' },
    'T-Mobile': { city: 'Bellevue', region: 'WA' },
    'Vodafone': { city: 'London', region: 'England' },
    'O2': { city: 'Slough', region: 'England' },
    'Telekom': { city: 'Bonn', region: 'NRW' },
    'Orange': { city: 'Paris', region: 'Île-de-France' },
  };
  for (const [carrier, location] of Object.entries(locations)) {
    if (carrierName && carrierName.toLowerCase().includes(carrier.toLowerCase())) return location;
  }
  const defaults = {
    'US': { city: 'New York', region: 'NY' },
    'GB': { city: 'London', region: 'England' },
    'DE': { city: 'Berlin', region: 'Berlin' },
    'FR': { city: 'Paris', region: 'Île-de-France' },
    'CA': { city: 'Toronto', region: 'ON' },
    'AU': { city: 'Sydney', region: 'NSW' },
    'NP': { city: 'Kathmandu', region: 'Bagmati' },
  };
  return defaults[countryCode] || { city: 'Unknown', region: 'Unknown' };
}

const timezoneData = {
  'US': ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
  'GB': ['Europe/London'],
  'DE': ['Europe/Berlin'],
  'FR': ['Europe/Paris'],
  'CA': ['America/Toronto', 'America/Vancouver'],
  'AU': ['Australia/Sydney', 'Australia/Melbourne'],
  'NP': ['Asia/Kathmandu'],
  'IN': ['Asia/Kolkata'],
  'CN': ['Asia/Shanghai'],
  'JP': ['Asia/Tokyo'],
  'BR': ['America/Sao_Paulo'],
  'MX': ['America/Mexico_City'],
  'RU': ['Europe/Moscow'],
  'IT': ['Europe/Rome'],
  'ES': ['Europe/Madrid'],
};

function getTimezone(countryCode) {
  const timezones = timezoneData[countryCode];
  if (!timezones) return 'Unknown';
  return timezones[0];
}

function formatTimezoneOffset(timezone) {
  try {
    const now = new Date();
    const tzString = now.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' });
    const match = tzString.match(/GMT([+-]\d+)?/);
    if (match && match[1]) return `UTC${match[1]}`;
    return 'UTC+0';
  } catch { return 'Unknown'; }
}

function parsePhoneNumberComponents(number, countryCode) {
  const cleaned = number.replace(/\D/g, '');
  const countryCodes = {
    'US': { code: '1', areaDigits: 3, subscriberDigits: 7 },
    'CA': { code: '1', areaDigits: 3, subscriberDigits: 7 },
    'GB': { code: '44', areaDigits: 4, subscriberDigits: 6 },
    'DE': { code: '49', areaDigits: 3, subscriberDigits: 7 },
    'FR': { code: '33', areaDigits: 1, subscriberDigits: 8 },
    'NP': { code: '977', areaDigits: 3, subscriberDigits: 7 },
    'IN': { code: '91', areaDigits: 4, subscriberDigits: 6 },
    'CN': { code: '86', areaDigits: 3, subscriberDigits: 8 },
    'JP': { code: '81', areaDigits: 3, subscriberDigits: 8 },
    'AU': { code: '61', areaDigits: 2, subscriberDigits: 8 },
    'BR': { code: '55', areaDigits: 2, subscriberDigits: 9 },
    'MX': { code: '52', areaDigits: 3, subscriberDigits: 7 },
    'RU': { code: '7', areaDigits: 3, subscriberDigits: 7 },
    'IT': { code: '39', areaDigits: 3, subscriberDigits: 7 },
    'ES': { code: '34', areaDigits: 3, subscriberDigits: 6 },
  };
  const config = countryCodes[countryCode] || { code: countryCode, areaDigits: 3, subscriberDigits: 7 };
  const withoutCountry = cleaned.startsWith(config.code) ? cleaned.slice(config.code.length) : cleaned;
  const areaCode = withoutCountry.slice(0, config.areaDigits);
  const subscriberNumber = withoutCountry.slice(config.areaDigits);
  return {
    countryCode: config.code,
    areaCode: areaCode || 'Unknown',
    subscriberNumber: subscriberNumber || 'Unknown',
    nationalFormat: areaCode ? `${areaCode}-${subscriberNumber}` : subscriberNumber,
    internationalFormat: `+${config.code} ${areaCode}-${subscriberNumber}`,
    areaCodeLength: areaCode !== 'Unknown' ? `${areaCode.length} Digit` : 'Unknown'
  };
}

function validatePhoneNumber(number) {
  if (!number || typeof number !== 'string') return { valid: false, error: 'Phone number is required' };
  const cleaned = number.replace(/[^\d+]/g, '');
  const phoneRegex = /^\+\d{10,15}$/;
  if (!phoneRegex.test(cleaned)) return { valid: false, error: 'Invalid format. Use +14155552671' };
  return { valid: true, cleaned };
}

// API Endpoint
app.get('/api/phone-info', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const phoneNumber = req.query.number;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number required. Use: /api/phone-info?number=+1234567890' });
  }

  const validation = validatePhoneNumber(phoneNumber);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    let apiData = { valid: false, country_name: null, carrier: null, country_code: null, line_type: null };

    if (API_KEYS.length > 0) {
      const maxRetries = Math.min(API_KEYS.length, 3);
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = getNextApiKey();
        if (!apiKey) break;
        try {
          const response = await axios.get(NUMVERIFY_BASE_URL, {
            params: { access_key: apiKey, number: validation.cleaned, format: 1 },
            timeout: 8000,
            headers: { 'User-Agent': 'PhoneSint/1.0', 'Accept': 'application/json' },
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 300,
          });
          if (response.data && response.data.success !== false) {
            apiData = response.data;
            apiUsage.numverify.used++;
            break;
          }
        } catch (error) {
          console.warn(`Key ${attempt + 1} failed:`, error.message);
          continue;
        }
      }
      if (!apiData.valid) {
        apiData = { valid: true, country_name: 'United States', carrier: 'Unavailable', country_code: 'US', line_type: 'mobile' };
      }
    } else {
      apiData = { valid: true, country_name: 'United States', carrier: 'Simulated', country_code: 'US', line_type: 'mobile' };
    }

    if (!apiData.valid) {
      return res.status(404).json({ error: 'Phone number not found' });
    }

    const location = getEstimatedLocation(apiData.carrier || '', apiData.country_code || '');
    const timezone = getTimezone(apiData.country_code || 'US');
    const timezoneOffset = formatTimezoneOffset(timezone);
    const components = parsePhoneNumberComponents(validation.cleaned, apiData.country_code || 'US');
    
    const responseData = {
      inputNumber: validation.cleaned,
      phoneDetails: {
        country: apiData.country_name || 'Unknown',
        countryCode: apiData.country_code || 'Unknown',
        location,
        carrier: apiData.carrier || 'Unknown',
        lineType: apiData.line_type || 'Unknown',
        timezone: timezone,
        timezoneOffset: timezoneOffset,
        internationalPrefix: '00 or +',
        numberComponents: {
          nationalFormat: components.nationalFormat,
          internationalFormat: components.internationalFormat,
          areaCode: components.areaCode,
          subscriberNumber: components.subscriberNumber,
          areaCodeLength: components.areaCodeLength
        }
      }
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API Usage Tracking (in-memory)
const apiUsage = {
  numverify: { used: 0, limit: 1000, resetDate: new Date().toISOString().split('T')[0] },
  abstract: { used: 0, limit: 1000, resetDate: new Date().toISOString().split('T')[0] }
};

function resetUsageIfNeeded() {
  const today = new Date().toISOString().split('T')[0];
  if (apiUsage.numverify.resetDate !== today) {
    apiUsage.numverify.used = 0;
    apiUsage.numverify.resetDate = today;
  }
  if (apiUsage.abstract.resetDate !== today) {
    apiUsage.abstract.used = 0;
    apiUsage.abstract.resetDate = today;
  }
}

app.get('/api/health', (req, res) => {
  resetUsageIfNeeded();
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: 'healthy', service: 'PhoneSint', timestamp: new Date().toISOString() });
});

// API Usage Endpoint
app.get('/api/usage', (req, res) => {
  resetUsageIfNeeded();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    numverify: { ...apiUsage.numverify, keys: API_KEYS.length },
    abstract: { ...apiUsage.abstract, configured: !!process.env.ABSTRACT_API_KEY }
  });
});

// Static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal error' });
});

const server = app.listen(PORT, () => {
  console.log(`✓ PhoneSint running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT', () => { server.close(() => process.exit(0)); });

module.exports = app;
