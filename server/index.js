const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('colyseus');
const { WebSocketTransport } = require('@colyseus/ws-transport');
const { BattleRoom } = require('./rooms/BattleRoom');

const port = process.env.PORT || 2567;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    game: 'WorldWars',
    version: '1.0.0',
    status: 'online',
    rooms: ['battle'],
    message: 'WorldWars Multiplayer Server is running. Connect via WebSocket.'
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({ server })
});

gameServer.define('battle', BattleRoom);

gameServer.listen(port).then(() => {
  console.log(`WorldWars Server running on port ${port}`);
});
