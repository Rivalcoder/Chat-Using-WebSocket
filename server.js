const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // To store clients with their keys

wss.on('connection', (ws, req) => {
  const key = req.url.split('key=')[1];
  console.log(`Client connected with key: ${key}`);
  clients.set(key, ws); // Store the client by key

  ws.on('message', (message) => {
    console.log(`Received message from ${key}: ${message}`);
    
    // Optional: Validate message format
    try {
      const parsedMessage = JSON.parse(message);
      broadcastMessage(parsedMessage, key);
    } catch (error) {
      console.error('Invalid message format:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected with key: ${key}`);
    clients.delete(key); // Remove client from the map
  });
});

function broadcastMessage(message, senderKey) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      // Send message to all clients
      client.send(JSON.stringify({ sender: message.sender, content: message.content }));
    }
  });
}

console.log('WebSocket server is running on ws://localhost:8080');
