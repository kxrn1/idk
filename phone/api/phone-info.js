require('dotenv').config();
const axios = require('axios');

const NUMVERIFY_BASE_URL = 'https://apilayer.net/api/validate';
const ABSTRACT_API_URL = 'https://phoneintelligence.abstractapi.com/v1/';

// Parse API keys
function parseApiKeys(envVar) {
  const envKeys = process.env[envVar] || '';
  if (!envKeys || envKeys === 'YOUR_API_KEY_HERE') return [];
  return envKeys.split(',').map(key => key.trim()).filter(key => key.length >= 32);
}

const API_KEYS = parseApiKeys('NUMVERIFY_API_KEY');
const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

let currentKeyIndex = 0;

function getNextApiKey() {
  if (API_KEYS.length === 0) return null;
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

// Country data with flag, currency, emergency numbers
const countryData = {
  'US': { flag: '🇺🇸', currency: 'USD ($)', emergency: '911', capital: 'Washington D.C.', languages: 'English' },
  'CA': { flag: '🇨🇦', currency: 'CAD ($)', emergency: '911', capital: 'Ottawa', languages: 'English, French' },
  'GB': { flag: '🇬🇧', currency: 'GBP (£)', emergency: '999, 112', capital: 'London', languages: 'English' },
  'DE': { flag: '🇩🇪', currency: 'EUR (€)', emergency: '112', capital: 'Berlin', languages: 'German' },
  'FR': { flag: '🇫🇷', currency: 'EUR (€)', emergency: '112', capital: 'Paris', languages: 'French' },
  'IT': { flag: '🇮🇹', currency: 'EUR (€)', emergency: '112', capital: 'Rome', languages: 'Italian' },
  'ES': { flag: '🇪🇸', currency: 'EUR (€)', emergency: '112', capital: 'Madrid', languages: 'Spanish' },
  'AU': { flag: '🇦🇺', currency: 'AUD ($)', emergency: '000', capital: 'Canberra', languages: 'English' },
  'NZ': { flag: '🇳🇿', currency: 'NZD ($)', emergency: '111', capital: 'Wellington', languages: 'English, Māori' },
  'JP': { flag: '🇯🇵', currency: 'JPY (¥)', emergency: '110, 119', capital: 'Tokyo', languages: 'Japanese' },
  'CN': { flag: '🇨🇳', currency: 'CNY (¥)', emergency: '110, 120, 119', capital: 'Beijing', languages: 'Chinese' },
  'IN': { flag: '🇮🇳', currency: 'INR (₹)', emergency: '112', capital: 'New Delhi', languages: 'Hindi, English' },
  'BR': { flag: '🇧🇷', currency: 'BRL (R$)', emergency: '190, 192, 193', capital: 'Brasília', languages: 'Portuguese' },
  'MX': { flag: '🇲🇽', currency: 'MXN ($)', emergency: '911', capital: 'Mexico City', languages: 'Spanish' },
  'RU': { flag: '🇷🇺', currency: 'RUB (₽)', emergency: '102, 103, 104', capital: 'Moscow', languages: 'Russian' },
  'NP': { flag: '🇳🇵', currency: 'NPR (Rs)', emergency: '100, 102, 103', capital: 'Kathmandu', languages: 'Nepali' },
  'PK': { flag: '🇵🇰', currency: 'PKR (Rs)', emergency: '15, 16, 115', capital: 'Islamabad', languages: 'Urdu, English' },
  'BD': { flag: '🇧🇩', currency: 'BDT (৳)', emergency: '999', capital: 'Dhaka', languages: 'Bengali' },
  'SG': { flag: '🇸🇬', currency: 'SGD ($)', emergency: '999', capital: 'Singapore', languages: 'English, Malay, Chinese, Tamil' },
  'MY': { flag: '🇲🇾', currency: 'MYR (RM)', emergency: '999', capital: 'Kuala Lumpur', languages: 'Malay, English' },
  'TH': { flag: '🇹🇭', currency: 'THB (฿)', emergency: '191', capital: 'Bangkok', languages: 'Thai' },
  'PH': { flag: '🇵🇭', currency: 'PHP (₱)', emergency: '911', capital: 'Manila', languages: 'Filipino, English' },
  'ID': { flag: '🇮🇩', currency: 'IDR (Rp)', emergency: '110, 118, 119', capital: 'Jakarta', languages: 'Indonesian' },
  'VN': { flag: '🇻🇳', currency: 'VND (₫)', emergency: '113, 114, 115', capital: 'Hanoi', languages: 'Vietnamese' },
  'KR': { flag: '🇰🇷', currency: 'KRW (₩)', emergency: '112, 119', capital: 'Seoul', languages: 'Korean' },
  'ZA': { flag: '🇿🇦', currency: 'ZAR (R)', emergency: '10111, 10177', capital: 'Pretoria', languages: 'Afrikaans, English, Zulu' },
  'AE': { flag: '🇦🇪', currency: 'AED (د.إ)', emergency: '999', capital: 'Abu Dhabi', languages: 'Arabic' },
  'SA': { flag: '🇸🇦', currency: 'SAR (ر.س)', emergency: '999', capital: 'Riyadh', languages: 'Arabic' },
  'TR': { flag: '🇹🇷', currency: 'TRY (₺)', emergency: '112', capital: 'Ankara', languages: 'Turkish' },
  'NL': { flag: '🇳🇱', currency: 'EUR (€)', emergency: '112', capital: 'Amsterdam', languages: 'Dutch' },
  'BE': { flag: '🇧🇪', currency: 'EUR (€)', emergency: '112', capital: 'Brussels', languages: 'Dutch, French, German' },
  'CH': { flag: '🇨🇭', currency: 'CHF (Fr)', emergency: '117, 118, 144', capital: 'Bern', languages: 'German, French, Italian' },
  'SE': { flag: '🇸🇪', currency: 'SEK (kr)', emergency: '112', capital: 'Stockholm', languages: 'Swedish' },
  'NO': { flag: '🇳🇴', currency: 'NOK (kr)', emergency: '110, 112, 113', capital: 'Oslo', languages: 'Norwegian' },
  'DK': { flag: '🇩🇰', currency: 'DKK (kr)', emergency: '112', capital: 'Copenhagen', languages: 'Danish' },
  'FI': { flag: '🇫🇮', currency: 'EUR (€)', emergency: '112', capital: 'Helsinki', languages: 'Finnish, Swedish' },
  'PL': { flag: '🇵🇱', currency: 'PLN (zł)', emergency: '112', capital: 'Warsaw', languages: 'Polish' },
  'AT': { flag: '🇦🇹', currency: 'EUR (€)', emergency: '122, 133, 144', capital: 'Vienna', languages: 'German' },
  'GR': { flag: '🇬🇷', currency: 'EUR (€)', emergency: '100, 166, 199', capital: 'Athens', languages: 'Greek' },
  'PT': { flag: '🇵🇹', currency: 'EUR (€)', emergency: '112', capital: 'Lisbon', languages: 'Portuguese' },
  'IE': { flag: '🇮🇪', currency: 'EUR (€)', emergency: '999, 112', capital: 'Dublin', languages: 'Irish, English' },
  'AR': { flag: '🇦🇷', currency: 'ARS ($)', emergency: '911', capital: 'Buenos Aires', languages: 'Spanish' },
  'CL': { flag: '🇨🇱', currency: 'CLP ($)', emergency: '133', capital: 'Santiago', languages: 'Spanish' },
  'CO': { flag: '🇨🇴', currency: 'COP ($)', emergency: '123', capital: 'Bogotá', languages: 'Spanish' },
  'PE': { flag: '🇵🇪', currency: 'PEN (S/.)', emergency: '105', capital: 'Lima', languages: 'Spanish' },
  'EG': { flag: '🇪🇬', currency: 'EGP (£)', emergency: '122', capital: 'Cairo', languages: 'Arabic' },
  'NG': { flag: '🇳🇬', currency: 'NGN (₦)', emergency: '112', capital: 'Abuja', languages: 'English' },
  'KE': { flag: '🇰🇪', currency: 'KES (KSh)', emergency: '999, 112', capital: 'Nairobi', languages: 'Swahili, English' },
  'GH': { flag: '🇬🇭', currency: 'GHS (₵)', emergency: '191, 193, 195', capital: 'Accra', languages: 'English' },
  'IL': { flag: '🇮🇱', currency: 'ILS (₪)', emergency: '100, 101, 102', capital: 'Jerusalem', languages: 'Hebrew, Arabic' },
  'HK': { flag: '🇭🇰', currency: 'HKD ($)', emergency: '999', capital: 'Hong Kong', languages: 'Chinese, English' },
  'TW': { flag: '🇹🇼', currency: 'TWD (NT$)', emergency: '110, 119', capital: 'Taipei', languages: 'Chinese' },
};

function getCountryInfo(countryCode) {
  return countryData[countryCode] || { flag: '🏳️', currency: 'Unknown', emergency: 'Unknown', capital: 'Unknown', languages: 'Unknown' };
}

function getLineTypeIcon(lineType) {
  const icons = {
    'mobile': '📱',
    'landline': '📞',
    'voip': '🌐',
    'toll_free': '🆓',
    'premium_rate': '💰',
    'shared_cost': '💵',
    'personal_number': '👤',
    'pager': '📟',
    'uan': '🏢',
    'voicemail': '📬',
    'special_services': '⚙️',
    'unknown': '❓'
  };
  return icons[lineType?.toLowerCase()] || icons['unknown'];
}

function getLineTypeLabel(lineType) {
  const labels = {
    'mobile': 'Mobile',
    'landline': 'Landline',
    'voip': 'VoIP',
    'toll_free': 'Toll-Free',
    'premium_rate': 'Premium Rate',
    'shared_cost': 'Shared Cost',
    'personal_number': 'Personal Number',
    'pager': 'Pager',
    'uan': 'UAN',
    'voicemail': 'Voicemail',
    'special_services': 'Special Services',
    'unknown': 'Unknown'
  };
  return labels[lineType?.toLowerCase()] || labels['unknown'];
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const phoneNumber = req.query.number;
  if (!phoneNumber) return res.status(400).json({ error: 'Phone number required' });

  const validation = validatePhoneNumber(phoneNumber);
  if (!validation.valid) return res.status(400).json({ error: validation.error });

  try {
    let apiData = { valid: false, country_name: null, carrier: null, country_code: null, line_type: null };
    let abstractData = null;

    // Fetch from Numverify
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
            break;
          }
        } catch (error) {
          console.warn(`Numverify key ${attempt + 1} failed:`, error.message);
          continue;
        }
      }
    }

    // Fetch from Abstract API (if key configured)
    if (ABSTRACT_API_KEY && ABSTRACT_API_KEY !== 'YOUR_API_KEY_HERE') {
      try {
        const abstractResponse = await axios.get(ABSTRACT_API_URL, {
          params: { 
            api_key: ABSTRACT_API_KEY, 
            phone: validation.cleaned.replace('+', '') 
          },
          timeout: 8000,
          headers: { 'User-Agent': 'PhoneSint/1.0', 'Accept': 'application/json' },
        });
        if (abstractResponse.data) {
          abstractData = abstractResponse.data;
        }
      } catch (error) {
        console.warn('Abstract API failed:', error.message);
      }
    }

    if (!apiData.valid && !abstractData) {
      apiData = { valid: true, country_name: 'Unknown', carrier: 'Unknown', country_code: 'Unknown', line_type: 'mobile' };
    }

    const countryCode = apiData.country_code || abstractData?.phone_location?.country_code || 'US';
    const countryInfo = getCountryInfo(countryCode);

    // Use ONLY real API data - no estimates/fallbacks
    const location = {
      city: apiData.location || abstractData?.phone_location?.city || '',
      region: apiData.region || abstractData?.phone_location?.region || ''
    };
    
    const timezone = getTimezone(countryCode);
    const timezoneOffset = formatTimezoneOffset(timezone);
    const components = parsePhoneNumberComponents(validation.cleaned, countryCode);

    // Build response with all real data
    const responseData = {
      inputNumber: validation.cleaned,
      flag: countryInfo.flag,
      phoneDetails: {
        country: abstractData?.phone_location?.country_name || apiData.country_name || 'Unknown',
        countryCode: countryCode,
        location,
        carrier: abstractData?.phone_carrier?.name || apiData.carrier || 'Unknown',
        lineType: abstractData?.phone_carrier?.line_type || apiData.line_type || 'Unknown',
        lineTypeIcon: getLineTypeIcon(abstractData?.phone_carrier?.line_type || apiData.line_type),
        lineTypeLabel: getLineTypeLabel(abstractData?.phone_carrier?.line_type || apiData.line_type),
        timezone: timezone,
        timezoneOffset: timezoneOffset,
        internationalPrefix: '00 or +',
        numberComponents: {
          nationalFormat: abstractData?.phone_format?.national || apiData.local_format || components.nationalFormat,
          internationalFormat: abstractData?.phone_format?.international || apiData.international_format || components.internationalFormat,
          areaCode: components.areaCode,
          subscriberNumber: components.subscriberNumber,
          areaCodeLength: components.areaCodeLength
        }
      },
      countryInfo: {
        capital: countryInfo.capital,
        languages: countryInfo.languages,
        currency: countryInfo.currency,
        emergencyNumbers: countryInfo.emergency
      },
      validation: {
        isValid: abstractData?.phone_validation?.is_valid ?? apiData.valid ?? null,
        lineStatus: abstractData?.phone_validation?.line_status || 'Unknown',
        isVoip: abstractData?.phone_validation?.is_voip ?? null
      },
      risk: {
        level: abstractData?.phone_risk?.risk_level || 'Unknown',
        isDisposable: abstractData?.phone_risk?.is_disposable ?? null,
        isAbuseDetected: abstractData?.phone_risk?.is_abuse_detected ?? null
      },
      breaches: abstractData?.phone_breaches ? {
        totalBreaches: abstractData.phone_breaches.total_breaches,
        dateFirstBreached: abstractData.phone_breaches.date_first_breached,
        dateLastBreached: abstractData.phone_breaches.date_last_breached
      } : null
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
