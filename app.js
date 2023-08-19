const express = require('express');
const WebSocket = require('ws');
const http = require("http");

const app = express();
const server = app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// const wss = new WebSocket.WebSocketServer({server});
// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    // Add the client to the set of connected clients
    clients.add(ws);

    // Event listener for incoming messages from clients
    ws.on('message', (message) => {
        // Broadcast the message to all connected clients
        clients.forEach((client) => {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {
            if (client.readyState === WebSocket.OPEN) {
                let jsonData = {
                    "type": "response",
                    "description": "This is a response message from server",
                    "message": message.toString(),
                }
                client.send(JSON.stringify(jsonData));
            }
        });
    });

    // Event listener for client disconnection
    ws.on('close', () => {
        // Remove the client from the set of connected clients
        clients.delete(ws);
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    // custom message to websocket
    res.send("Hello World!");
});

// Route to send messages to WebSocket clients
app.post('/send', (req, res) => {

    let jsonDataRequestBody = req.body;

    const message = 'This message is sent from the route';

    let jsonData = {
        "type": "answer",
        "description": "This is a response message from server",
        "message": JSON.stringify(jsonDataRequestBody),
    }

    // Broadcast the message to all connected clients
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonData));
        }
    });

    res.send('Message sent to WebSocket clients');
});


app.post('/send2', (req, res) => {
    res.json(req.body)
})





module.exports = {app, server};