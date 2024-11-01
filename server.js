const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PRIVATE_KEY = 'your-private-key'; // Replace with your actual private key

wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const key = urlParams.get('key');

  if (key !== PRIVATE_KEY) {
    ws.close(); // Close the connection if the key is invalid
    return;
  }

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
