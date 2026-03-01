/**
 * Discord Username Collector - Secure Backend Proxy
 * 
 * This Node.js Express server acts as a secure proxy between the client-side
 * modal and the Discord Webhook API. It handles CORS, rate limiting, and
 * input validation to protect the webhook URL from exposure.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

/**
 * CORS Configuration
 * Controls which origins can access this API.
 * 
 * For production: Replace '*' with your specific frontend domain(s)
 * Example: origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
 * 
 * WARNING: Using '*' allows any website to call your API. Only use in development
 * or if you explicitly trust all origins.
 */
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

/**
 * Rate Limiter Configuration
 * Prevents abuse by limiting the number of requests per IP address.
 * 
 * Current settings: 10 requests per 15-minute window per IP
 * Adjust based on your expected traffic patterns.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if behind a proxy, otherwise use IP
    return req.headers['x-forwarded-for'] || req.ip;
  }
});

// Apply rate limiting to the webhook endpoint only
app.use('/api/submit-username', limiter);

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * JSON Body Parser
 * Parses incoming JSON payloads with size limits to prevent abuse.
 */
app.use(express.json({
  limit: '1kb', // Limit payload size to prevent large body attacks
  strict: true, // Only accept arrays and objects
  type: 'application/json'
}));

/**
 * Request Logger (Development Only)
 * Logs incoming requests for debugging purposes.
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================================
// INPUT VALIDATION HELPERS
// ============================================================================

/**
 * Sanitizes and validates the username input.
 * 
 * @param {string} username - The raw username input
 * @returns {{ valid: boolean, sanitized?: string, error?: string }}
 */
function validateUsername(username) {
  // Check if username exists and is a string
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username must be a non-empty string' };
  }

  // Trim whitespace
  const sanitized = username.trim();

  // Check length (Discord usernames are typically 2-32 characters)
  if (sanitized.length < 2 || sanitized.length > 32) {
    return { valid: false, error: 'Username must be between 2 and 32 characters' };
  }

  // Basic sanitization: remove potentially dangerous characters
  // Allow alphanumeric, underscores, hyphens, periods, and the # for old Discord tags
  const sanitizedUsername = sanitized.replace(/[^\w\s#.@-]/g, '');

  if (sanitizedUsername.length < 2) {
    return { valid: false, error: 'Username contains invalid characters' };
  }

  return { valid: true, sanitized: sanitizedUsername };
}

/**
 * Extracts client information for logging and embed purposes.
 * 
 * @param {object} req - Express request object
 * @returns {{ ip: string, userAgent: string, origin?: string }}
 */
function extractClientInfo(req) {
  return {
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
    userAgent: req.headers['user-agent'] || 'Unknown',
    origin: req.headers['origin'] || req.headers['referer'] || 'Unknown'
  };
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health Check Endpoint
 * Useful for monitoring and uptime checks.
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Username Submission Endpoint
 * 
 * Receives a username from the frontend modal and forwards it
 * to the Discord webhook with a formatted embed message.
 * 
 * Request Body: { "username": "string" }
 */
app.post('/api/submit-username', async (req, res) => {
  try {
    // Validate webhook URL is configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('ERROR: DISCORD_WEBHOOK_URL not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please contact the administrator.'
      });
    }

    // Validate and sanitize input
    const { username } = req.body;
    const validation = validateUsername(username);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const sanitizedUsername = validation.sanitized;
    const clientInfo = extractClientInfo(req);

    // Log the submission (for debugging/auditing)
    console.log(`Username submitted: ${sanitizedUsername} from IP: ${clientInfo.ip}`);

    // Construct Discord embed payload
    // Reference: https://discord.com/developers/docs/resources/channel#embed-object
    const discordPayload = {
      embeds: [{
        title: '📬 New Discord Username Submitted',
        description: `A user has submitted their Discord username through the website.`,
        color: 0x5865F2, // Discord Blurple color
        fields: [
          {
            name: '👤 Username',
            value: `\`${sanitizedUsername}\``,
            inline: true
          },
          {
            name: '🌐 Origin',
            value: clientInfo.origin.substring(0, 100) || 'Direct',
            inline: true
          },
          {
            name: '📍 IP Address',
            value: `\`${clientInfo.ip}\``,
            inline: true
          }
        ],
        footer: {
          text: 'Username Collector Bot',
          icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
        },
        timestamp: new Date().toISOString()
      }],
      username: 'Username Collector',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    };

    // Send to Discord webhook
    const response = await axios.post(webhookUrl, discordPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status >= 200 && status < 300
    });

    if (response.status >= 200 && response.status < 300) {
      // Success - respond to client
      res.json({
        success: true,
        message: 'Username submitted successfully'
      });
    } else {
      throw new Error(`Discord API returned status ${response.status}`);
    }

  } catch (error) {
    // Handle different error types
    console.error('Error forwarding to Discord:', error.message);

    if (error.response) {
      // Discord API returned an error response
      console.error('Discord API Error:', error.response.data);
      return res.status(502).json({
        success: false,
        error: 'Failed to forward to Discord. Please try again.'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: 'Request timed out. Please try again.'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 Handler - Catch undefined routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

/**
 * Global Error Handler - Catch unhandled errors
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         Discord Username Collector - Backend Server       ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                 ║
║  Environment: ${process.env.NODE_ENV || 'production'}                              ║
║  Rate Limit: 10 requests per 15 minutes per IP            ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
