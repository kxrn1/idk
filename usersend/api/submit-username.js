/**
 * Vercel Serverless Function - Discord Username Collector
 * 
 * This function acts as a secure proxy between the client-side modal
 * and the Discord Webhook API.
 */

const axios = require('axios');

// Rate limiting store (in-memory, resets on cold start)
const requestStore = new Map();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10; // 10 requests per window

/**
 * Simple rate limiter for serverless environment
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestStore.get(ip) || [];
  
  // Filter out old requests outside the window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return { allowed: false };
  }
  
  recentRequests.push(now);
  requestStore.set(ip, recentRequests);
  return { allowed: true };
}

/**
 * Sanitizes and validates the username input
 * Discord username format: 2-32 chars, lowercase alphanumeric, underscores, periods
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username must be a non-empty string' };
  }

  const sanitized = username.trim().toLowerCase();

  if (sanitized.length < 2 || sanitized.length > 32) {
    return { valid: false, error: 'Username must be between 2 and 32 characters' };
  }

  // Discord username format: lowercase alphanumeric, underscores, periods only
  const usernameRegex = /^[a-z0-9._]+$/;
  if (!usernameRegex.test(sanitized)) {
    return { valid: false, error: 'Username can only contain lowercase letters, numbers, underscores, and periods' };
  }

  return { valid: true, sanitized: sanitized };
}

/**
 * Validates Discord ID format (17-20 digits)
 */
function validateDiscordId(userId) {
  if (!userId || typeof userId !== 'string') {
    return { valid: true, sanitized: null }; // Optional field
  }

  const trimmed = userId.trim();

  if (trimmed.length === 0) {
    return { valid: true, sanitized: null }; // Empty is OK (optional)
  }

  // Discord IDs are 17-20 digit numbers (snowflakes)
  const discordIdRegex = /^\d{17,20}$/;
  if (!discordIdRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid Discord ID format. Must be 17-20 digits.' };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Fetch Discord user info from ID using Discord API
 */
async function getDiscordUserFromId(userId, botToken) {
  if (!userId || !botToken) return null;

  try {
    const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${botToken}`
      },
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 300
    });

    const user = response.data;
    return {
      username: user.username,
      discriminator: user.discriminator,
      global_name: user.global_name,
      id: user.id,
      display: user.global_name || `${user.username}#${user.discriminator}`
    };
  } catch (error) {
    console.error('Discord ID lookup failed:', error.message);
    return null;
  }
}

/**
 * Extract client info from request headers
 */
function extractClientInfo(req) {
  const headers = req.headers || {};
  return {
    ip: headers['x-forwarded-for']?.split(',')[0]?.trim() || headers['x-real-ip'] || 'Unknown',
    userAgent: headers['user-agent'] || 'Unknown',
    origin: headers['origin'] || headers['referer'] || 'Unknown'
  };
}

/**
 * Fetch detailed IP geolocation data
 */
async function getIPLocation(ip) {
  if (!ip || ip === 'Unknown') return null;
  
  try {
    // Use ipapi.co for free IP geolocation (no API key needed for basic usage)
    const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 300
    });
    
    const data = response.data;
    return {
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      postal: data.postal || 'Unknown',
      latitude: data.latitude || 'Unknown',
      longitude: data.longitude || 'Unknown',
      timezone: data.timezone || 'Unknown',
      isp: data.org || data.asn || 'Unknown',
      asn: data.asn || 'Unknown'
    };
  } catch (error) {
    console.error('IP lookup failed:', error.message);
    return null;
  }
}

/**
 * CORS headers helper
 */
function getCorsHeaders(origin) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
  const allowOrigin = allowedOrigins.length > 0 
    ? (allowedOrigins.includes(origin) ? origin : allowedOrigins[0])
    : '*';
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

/**
 * Main handler for Vercel serverless function
 */
module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers?.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const origin = req.headers?.origin;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Rate limiting
  const clientIp = extractClientInfo(req).ip;
  const rateLimit = checkRateLimit(clientIp);
  
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.'
    });
  }

  // Validate webhook URL
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('ERROR: DISCORD_WEBHOOK_URL not configured');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error'
    });
  }

  // Parse and validate input
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload'
    });
  }

  const { username, userId } = body || {};
  const validation = validateUsername(username);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error
    });
  }

  // Validate Discord ID if provided
  const userIdValidation = validateDiscordId(userId || '');
  if (!userIdValidation.valid) {
    return res.status(400).json({
      success: false,
      error: userIdValidation.error
    });
  }

  const sanitizedUsername = validation.sanitized;
  const sanitizedUserId = userIdValidation.sanitized;
  const clientInfo = extractClientInfo(req);

  console.log(`Username submitted: ${sanitizedUsername} from IP: ${clientInfo.ip}`);

  // Fetch Discord user info from ID if provided
  let discordUserInfo = null;
  if (sanitizedUserId && process.env.DISCORD_BOT_TOKEN) {
    discordUserInfo = await getDiscordUserFromId(sanitizedUserId, process.env.DISCORD_BOT_TOKEN);
    if (discordUserInfo) {
      console.log(`Discord ID resolved: ${discordUserInfo.display}`);
    }
  }

  // Fetch detailed IP location data
  const ipLocation = await getIPLocation(clientInfo.ip);

  // Construct Discord embed payload with detailed info
  const discordPayload = {
    embeds: [{
      title: '📬 New Discord Username Submitted',
      description: 'A user has submitted their Discord username through the website.',
      color: 0x5865F2,
      fields: [
        {
          name: '👤 Username',
          value: `\`${sanitizedUsername}\``,
          inline: true
        },
        {
          name: '🆔 Discord ID',
          value: sanitizedUserId 
            ? `\`${sanitizedUserId}\`${discordUserInfo ? ` (\`${discordUserInfo.display}\`)` : ' (lookup failed)'}`
            : 'Not provided',
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
        },
        {
          name: '🌎 Location',
          value: ipLocation
            ? `${ipLocation.city}, ${ipLocation.region}, ${ipLocation.country}`
            : 'Unknown',
          inline: true
        },
        {
          name: '🏢 ISP / ASN',
          value: ipLocation ? `\`${ipLocation.isp}\`` : 'Unknown',
          inline: true
        },
        {
          name: '🕐 Timezone',
          value: ipLocation ? `\`${ipLocation.timezone}\`` : 'Unknown',
          inline: true
        },
        {
          name: '📦 User Agent',
          value: `\`\`\`${clientInfo.userAgent.substring(0, 200)}\`\`\``,
          inline: false
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
  try {
    const response = await axios.post(webhookUrl, discordPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300
    });

    if (response.status >= 200 && response.status < 300) {
      return res.status(200).json({
        success: true,
        message: 'Username submitted successfully'
      });
    } else {
      throw new Error(`Discord API returned status ${response.status}`);
    }
  } catch (error) {
    console.error('Error forwarding to Discord:', error.message);

    if (error.response) {
      console.error('Discord API Error:', error.response.data);
      return res.status(502).json({
        success: false,
        error: 'Failed to forward to Discord'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: 'Request timed out'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  }
};
