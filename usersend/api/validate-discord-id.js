/**
 * Vercel Serverless Function - Validate Discord ID
 *
 * Validates a Discord ID by checking against Discord's API.
 * Requires DISCORD_BOT_TOKEN environment variable.
 */

const axios = require('axios');

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
 * Validates Discord ID format (17-20 digits)
 */
function validateDiscordIdFormat(userId) {
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'Discord ID is required' };
  }

  const trimmed = userId.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Discord ID cannot be empty' };
  }

  // Discord IDs are 17-20 digit numbers (snowflakes)
  const discordIdRegex = /^\d{17,20}$/;
  if (!discordIdRegex.test(trimmed)) {
    return { valid: false, error: 'Discord ID must be 17-20 digits' };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Fetch Discord user info from ID using Discord API
 */
async function getDiscordUserFromId(userId, botToken) {
  if (!userId || !botToken) {
    return { valid: false, error: 'Server configuration error' };
  }

  try {
    const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${botToken}`
      },
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 300
    });

    const user = response.data;

    // Build avatar URL
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || 0) % 5}.png`;

    // Calculate account creation date
    const snowflakeTimestamp = (BigInt(user.id) >> 22n) + 1420070400000n;
    const createdAt = new Date(Number(snowflakeTimestamp)).toISOString();

    // Get public flags/badges
    const badges = [];
    const flags = user.public_flags || 0;
    if (flags & 1) badges.push('Staff');
    if (flags & 2) badges.push('Partner');
    if (flags & 4) badges.push('HypeSquad Events');
    if (flags & 8) badges.push('Bug Hunter Level 1');
    if (flags & 64) badges.push('HypeSquad House Bravery');
    if (flags & 128) badges.push('HypeSquad House Brilliance');
    if (flags & 256) badges.push('HypeSquad House Balance');
    if (flags & 512) badges.push('Early Supporter');
    if (flags & 16384) badges.push('Bug Hunter Level 2');
    if (flags & 131072) badges.push('Verified Bot Developer');
    if (flags & 262144) badges.push('Active Developer');

    return {
      valid: true,
      user: {
        username: user.username,
        discriminator: user.discriminator,
        global_name: user.global_name,
        id: user.id,
        display: user.global_name || `${user.username}#${user.discriminator}`,
        avatar: avatarUrl,
        bot: user.bot || false,
        badges: badges,
        createdAt: createdAt,
        banner: user.banner ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=512` : null
      }
    };
  } catch (error) {
    console.error('Discord ID validation failed:', error.message);
    
    if (error.response?.status === 404) {
      return { valid: false, error: 'Invalid Discord ID. Please check the guide below!' };
    }
    
    if (error.response?.status === 401) {
      return { valid: false, error: 'Server configuration error' };
    }
    
    if (error.response?.status === 429) {
      return { valid: false, error: 'Rate limited. Please try again.' };
    }

    return { valid: false, error: 'Failed to validate Discord ID' };
  }
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

  // Validate webhook URL and bot token
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    console.error('ERROR: DISCORD_BOT_TOKEN not configured');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: Missing bot token'
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

  const { userId } = body || {};

  // Validate Discord ID format
  const formatValidation = validateDiscordIdFormat(userId);
  if (!formatValidation.valid) {
    return res.status(400).json({
      success: false,
      error: formatValidation.error
    });
  }

  const sanitizedUserId = formatValidation.sanitized;

  // Validate with Discord API
  const validationResult = await getDiscordUserFromId(sanitizedUserId, botToken);

  if (!validationResult.valid) {
    return res.status(400).json({
      success: false,
      error: validationResult.error
    });
  }

  // Return validated user info
  return res.status(200).json({
    success: true,
    user: validationResult.user
  });
};
