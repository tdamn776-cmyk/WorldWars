import { create } from 'zustand';
import * as Colyseus from 'colyseus.js';

const SERVER_URL = 'wss://worldwars-server.onrender.com';

let client;
try {
  client = new Colyseus.Client(SERVER_URL);
} catch (e) {
  console.warn('Colyseus client init failed', e);
  client = null;
}

const useGameStore = create((set, get) => ({
  screen: 'splash',
  setScreen: (scr) => set({ screen: scr }),

  room: null,
  networkPlayers: {},
  networkProjectiles: {},
  connectionStatus: 'disconnected',

  connectToBattle: async (userData) => {
    if (!client) {
      set({ connectionStatus: 'error' });
      return;
    }
    set({ connectionStatus: 'connecting' });
    try {
      const room = await client.joinOrCreate('battle', userData);
      set({ room, connectionStatus: 'connected' });

      room.state.players.onAdd((player, sessionId) => {
        set((state) => ({
          networkPlayers: { ...state.networkPlayers, [sessionId]: player }
        }));
        player.onChange(() => {
          set((state) => ({
            networkPlayers: { ...state.networkPlayers, [sessionId]: player }
          }));
        });
      });

      room.state.players.onRemove((player, sessionId) => {
        set((state) => {
          const copy = { ...state.networkPlayers };
          delete copy[sessionId];
          return { networkPlayers: copy };
        });
      });

      room.state.projectiles.onAdd((proj, projId) => {
        set((state) => ({
          networkProjectiles: { ...state.networkProjectiles, [projId]: proj }
        }));
      });

      room.state.projectiles.onRemove((proj, projId) => {
        set((state) => {
          const copy = { ...state.networkProjectiles };
          delete copy[projId];
          return { networkProjectiles: copy };
        });
      });

      room.onMessage('player_died', (msg) => {
        console.log(`Player ${msg.id} died`);
      });

      room.onLeave(() => {
        set({ room: null, connectionStatus: 'disconnected', networkPlayers: {}, networkProjectiles: {} });
      });

    } catch (e) {
      console.error('Connection failed:', e);
      set({ connectionStatus: 'error' });
    }
  },

  leaveBattle: () => {
    const { room } = get();
    if (room) room.leave();
    set({ room: null, connectionStatus: 'disconnected', networkPlayers: {}, networkProjectiles: {}, screen: 'mainMenu' });
  }
}));

export default useGameStore;
