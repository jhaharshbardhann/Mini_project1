/**
 * Accurate Group of Institutions - College Event Registration System
 * Node.js Server & REST API
 * 
 * Works out-of-the-box using pure Node.js built-in modules (Zero dependencies needed!)
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const REGS_FILE = path.join(DATA_DIR, 'registrations.json');

// Ensure data folder and file exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(REGS_FILE)) {
    fs.writeFileSync(REGS_FILE, JSON.stringify([], null, 2));
}

// MIME types dictionary
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Helper to read registrations from disk
function readRegistrations() {
    try {
        const raw = fs.readFileSync(REGS_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

// Helper to save registrations to disk
function saveRegistrations(data) {
    try {
        fs.writeFileSync(REGS_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error("Failed to save data:", e);
        return false;
    }
}

// Helper to parse JSON body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS Headers for API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // --- REST API ENDPOINTS ---
    if (pathname === '/api/registrations' && req.method === 'GET') {
        const data = readRegistrations();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: data.length, data }));
        return;
    }

    if (pathname === '/api/register' && req.method === 'POST') {
        const body = await getRequestBody(req);
        if (!body.name || !body.roll || !body.event) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Missing required registration fields' }));
            return;
        }

        const data = readRegistrations();
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const registration = {
            id: `AGI-2026-${randomNum}`,
            name: body.name,
            roll: body.roll.toUpperCase(),
            email: body.email,
            mobile: body.mobile,
            branch: body.branch || 'General',
            year: body.year || '1st Year',
            event: body.event,
            participationType: body.participationType || 'Solo',
            teamDetails: body.teamDetails || '',
            registeredAt: new Date().toLocaleString('en-IN')
        };

        data.unshift(registration);
        saveRegistrations(data);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Registration successful', registration }));
        return;
    }

    if (pathname.startsWith('/api/status/')) {
        const query = decodeURIComponent(pathname.replace('/api/status/', '')).trim().toUpperCase();
        const data = readRegistrations();
        const matches = data.filter(r => r.id.toUpperCase() === query || r.roll.toUpperCase() === query);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, matches }));
        return;
    }

    // --- STATIC FILE SERVING ---
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    
    // Security check: keep in public dir
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Access denied');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback for html pages without extension
            if (!path.extname(filePath)) {
                const htmlPath = filePath + '.html';
                if (fs.existsSync(htmlPath)) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
                    fs.createReadStream(htmlPath).pipe(res);
                    return;
                }
            }
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🎓 Accurate Group of Institutions - Event Hub Running!`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`🚀 Open index.html in your browser to view the website.`);
    console.log(`=======================================================`);
});
