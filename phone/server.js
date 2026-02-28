require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Trust proxy for Vercel deployment (enables proper IP detection)
app.set('trust proxy', 1);

// Helmet for security headers with strict CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://apilayer.net"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// CORS configuration - restrict to allowed origins only
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
}));

// Rate limiting - prevent abuse (general)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});
app.use('/api/', generalLimiter);

// Stricter rate limit for phone lookups
const phoneLookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many phone lookup requests, please try again later.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded for phone lookups',
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  },
});

// Body parser with strict size limits
app.use(express.json({ 
  limit: '10kb',
  strict: true,
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10kb',
  parameterLimit: 10,
}));

// Static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  cacheControl: true,
}));

// ============================================
// API CONFIGURATION
// ============================================

const NUMVERIFY_BASE_URL = 'https://apilayer.net/api/validate';

// Support multiple API keys for load balancing and redundancy
// Keys can be comma-separated in environment variable
function parseApiKeys() {
  const envKeys = process.env.NUMVERIFY_API_KEY || '';
  if (!envKeys || envKeys === 'YOUR_API_KEY_HERE') {
    return [];
  }
  // Split by comma, trim whitespace, filter empty values
  return envKeys.split(',').map(key => key.trim()).filter(key => key.length >= 32);
}

const API_KEYS = parseApiKeys();
let currentKeyIndex = 0;

// Get next API key (round-robin)
function getNextApiKey() {
  if (API_KEYS.length === 0) return null;
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

// Validate API keys are configured
if (API_KEYS.length === 0) {
  console.warn('⚠️  WARNING: NUMVERIFY_API_KEY not configured. Running in SIMULATION MODE only.');
  console.warn('   Set the environment variable to enable real API lookups.');
} else {
  console.log(`✓ Loaded ${API_KEYS.length} API key(s) for load balancing`);
}

// ============================================
// DATA SIMULATION FUNCTIONS
// ============================================

function getSimulatedOwnerName() {
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirst} ${randomLast}`;
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
    if (carrierName && carrierName.toLowerCase().includes(carrier.toLowerCase())) {
      return location;
    }
  }
  
  const countryDefaults = {
    'US': { city: 'New York', region: 'NY' },
    'GB': { city: 'London', region: 'England' },
    'DE': { city: 'Berlin', region: 'Berlin' },
    'FR': { city: 'Paris', region: 'Île-de-France' },
    'CA': { city: 'Toronto', region: 'ON' },
    'AU': { city: 'Sydney', region: 'NSW' },
  };
  
  return countryDefaults[countryCode] || { city: 'Unknown', region: 'Unknown' };
}

// ============================================
// INPUT VALIDATION
// ============================================

function validatePhoneNumber(number) {
  if (!number || typeof number !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }
  
  // Sanitize: remove any non-digit characters except +
  const cleaned = number.replace(/[^\d+]/g, '');
  
  // Must start with + and have 10-15 digits after (E.164 format)
  const phoneRegex = /^\+\d{10,15}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: 'Invalid phone number format. Use international format (e.g., +14155552671)' };
  }
  
  return { valid: true, cleaned };
}

// ============================================
// API ENDPOINTS
// ============================================

app.get('/api/phone-info/:number', phoneLookupLimiter, async (req, res) => {
  const validationResult = validatePhoneNumber(req.params.number);

  if (!validationResult.valid) {
    return res.status(400).json({ error: validationResult.error });
  }

  const phoneNumber = validationResult.cleaned;

  try {
    let apiData = { valid: false, country_name: null, carrier: null, country_code: null, line_type: null };

    // Try API keys with round-robin load balancing and retry logic
    if (API_KEYS.length > 0) {
      const maxRetries = Math.min(API_KEYS.length, 3); // Try up to 3 different keys
      let lastError = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = getNextApiKey();
        if (!apiKey) break;

        try {
          const response = await axios.get(NUMVERIFY_BASE_URL, {
            params: {
              access_key: apiKey,
              number: phoneNumber,
              format: 1,
            },
            timeout: 8000,
            headers: {
              'User-Agent': 'PhoneSint/1.0',
              'Accept': 'application/json',
            },
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 300,
          });

          if (response.data && response.data.success !== false) {
            apiData = response.data;
            break; // Success, exit retry loop
          }
        } catch (error) {
          lastError = error;
          console.warn(`API key attempt ${attempt + 1} failed:`, error.message);
          // Continue to next key
          continue;
        }
      }

      // If all keys failed, use fallback
      if (!apiData.valid) {
        console.warn('All API keys failed, using simulation fallback');
        apiData = {
          valid: true,
          country_name: 'United States',
          carrier: 'Carrier Lookup Unavailable',
          country_code: 'US',
          line_type: 'mobile'
        };
      }
    } else {
      console.log('No API keys configured. Using simulation mode.');
      apiData = {
        valid: true,
        country_name: 'United States',
        carrier: 'Simulated Carrier',
        country_code: 'US',
        line_type: 'mobile'
      };
    }

    if (!apiData.valid) {
      return res.status(404).json({ error: 'The phone number is invalid or could not be found.' });
    }

    const location = getEstimatedLocation(apiData.carrier || '', apiData.country_code || '');
    const ownerName = getSimulatedOwnerName();
    const deviceInfo = getSimulatedDeviceInfo();

    const responseData = {
      inputNumber: phoneNumber,
      owner: {
        fullName: ownerName,
        disclaimer: 'Owner name is simulated for demonstration purposes'
      },
      phoneDetails: {
        country: apiData.country_name || 'Unknown',
        countryCode: apiData.country_code || 'Unknown',
        location: location,
        carrier: apiData.carrier || 'Unknown',
        lineType: apiData.line_type || 'Unknown'
      },
      device: deviceInfo,
      credits: {
        idea: 'Ytx12',
        coding: 'terror._1',
        website: 'qvfear'
      }
    };

    res.json(responseData);

  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'An internal server error occurred. Please try again later.' });
  }
});

// Health check endpoint (lightweight, no rate limiting)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'PhoneSint',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  
  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({ 
    error: isProduction ? 'Internal server error' : err.message 
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const server = app.listen(PORT, () => {
  console.log(`✅ PhoneSint server running on http://localhost:${PORT}`);
  console.log(`🔒 Security: Helmet enabled, Rate limiting active, CORS configured`);
  if (!NUMVERIFY_API_KEY || NUMVERIFY_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('⚠️  Numverify API key not set. Running in SIMULATION MODE.');
  } else {
    console.log('✓ Numverify API configured');
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = app;
