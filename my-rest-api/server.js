const http = require('http');
const url = require('url');
const MyEmitter = require('./indexs');
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
    MyEmitter.emit('log', `Incoming request: ${req.method} ${req.url}`);
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
            
            users.push(newUser);
            MyEmitter.emit('log', `User added: ${newUser.name}`);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
    }
    // DELETE request to /users/

    else if (path.startsWith('/users/') && method === 'DELETE') {
        const username = parsedUrl.pathname.split('/')[2];
        const index = users.findIndex(user => user.name === username);
        if (index !== -1) {
            users.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User deleted successfully' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('User not found');
        }
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
