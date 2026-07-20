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

const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({
    server
  })
});

// Register BattleRoom
gameServer.define('battle', BattleRoom);

// Health check endpoint for Render.com
app.get('/health', (req, res) => res.json({ status: "ok" }));

gameServer.listen(port).then(() => {
  console.log(`⚔️ WorldWars Battle Multiplayer Server running on ws://localhost:${port}`);
});
