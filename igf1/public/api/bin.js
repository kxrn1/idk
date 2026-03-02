// Vercel Serverless Function - Secure JSONBin.io Proxy
const https = require('https');

const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
const BIN_ID = process.env.JSONBIN_BIN_ID;

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: null, raw: data });
                }
            });
        });

        req.on('error', (err) => reject(err));
        if (options.body) req.write(options.body);
        req.end();
    });
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!MASTER_KEY || !BIN_ID) {
        console.error('Missing JSONBin credentials');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // GET - Fetch APIs
        if (req.method === 'GET') {
            const response = await makeRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                method: 'GET',
                headers: { 'X-Master-Key': MASTER_KEY, 'X-Bin-Meta': 'false' }
            });

            if (response.status === 404 || !response.data) {
                return res.status(200).json([]);
            }

            if (response.status !== 200) {
                console.error('JSONBin fetch error:', response.status, response.raw);
                return res.status(response.status).json({ error: 'Failed to fetch' });
            }

            return res.status(200).json(Array.isArray(response.data) ? response.data : []);
        }

        // POST - Add new API
        if (req.method === 'POST') {
            const newApi = req.body;
            if (!newApi) {
                return res.status(400).json({ error: 'Request body required' });
            }

            // Fetch existing data
            const fetchRes = await makeRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                method: 'GET',
                headers: { 'X-Master-Key': MASTER_KEY, 'X-Bin-Meta': 'false' }
            });

            let existingData = [];
            if (fetchRes.status === 200 && fetchRes.data) {
                existingData = Array.isArray(fetchRes.data) ? fetchRes.data : [];
            }

            // Add new API
            const updatedData = [...existingData, newApi];
            console.log('Updating bin with', updatedData.length, 'APIs');

            // Update bin (without versioning for free plan)
            const updateRes = await makeRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': MASTER_KEY
                },
                body: JSON.stringify(updatedData)
            });

            if (updateRes.status !== 200) {
                console.error('JSONBin update error:', updateRes.status, updateRes.raw);
                return res.status(updateRes.status).json({ 
                    error: 'Failed to update JSONBin', 
                    details: updateRes.raw || updateRes.data 
                });
            }

            return res.status(200).json({ success: true, data: newApi });
        }

        // DELETE - Remove an API
        if (req.method === 'DELETE') {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'API ID required' });
            }

            // Fetch existing data
            const fetchRes = await makeRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                method: 'GET',
                headers: { 'X-Master-Key': MASTER_KEY, 'X-Bin-Meta': 'false' }
            });

            let existingData = [];
            if (fetchRes.status === 200 && fetchRes.data) {
                existingData = Array.isArray(fetchRes.data) ? fetchRes.data : [];
            }

            // Filter out the API to delete
            const updatedData = existingData.filter(api => api.id !== id);

            if (updatedData.length === existingData.length) {
                return res.status(404).json({ error: 'API not found' });
            }

            console.log('Deleting API, new count:', updatedData.length);

            // Update bin
            const updateRes = await makeRequest(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': MASTER_KEY
                },
                body: JSON.stringify(updatedData)
            });

            if (updateRes.status !== 200) {
                console.error('JSONBin delete error:', updateRes.status, updateRes.raw);
                return res.status(updateRes.status).json({
                    error: 'Failed to delete API',
                    details: updateRes.raw || updateRes.data
                });
            }

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};
