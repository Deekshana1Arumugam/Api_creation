const http = require('http');
const url = require('url');
const cors = require('cors'); 

// Example data
let users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
];
let inc=2;


const server = http.createServer((req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin

    // preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;

    const method = req.method;

    // GET request to /users
    if (path === '/users' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }

    // POST request to /users
    else if (path === '/users' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newUser = JSON.parse(body);
            inc+=1;
            newUser.id = inc;
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
    }

    // other routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
