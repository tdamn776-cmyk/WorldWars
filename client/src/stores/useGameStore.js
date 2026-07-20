import { create } from 'zustand';
import * as Colyseus from 'colyseus.js';

const client = new Colyseus.Client('ws://localhost:2567');

const useGameStore = create((set, get) => ({
  screen: 'splash',
  setScreen: (scr) => set({ screen: scr }),

  room: null,
  networkPlayers: {},
  networkProjectiles: {},
  connectionStatus: 'disconnected',

  connectToBattle: async (userData) => {
    set({ connectionStatus: 'connecting' });
    try {
      const room = await client.joinOrCreate('battle', userData);
      console.log('Joined battle successfully', room.sessionId);

      set({ room, connectionStatus: 'connected' });

      room.state.players.onAdd((player, sessionId) => {
        set((state) => ({
          networkPlayers: { ...state.networkPlayers, [sessionId]: player }
        }));
        
        // Listen for updates on this specific player object
        player.onChange(() => {
          set((state) => ({
            networkPlayers: { ...state.networkPlayers, [sessionId]: player }
          }));
        });
      });

      room.state.players.onRemove((player, sessionId) => {
        set((state) => {
          const newPlayers = { ...state.networkPlayers };
          delete newPlayers[sessionId];
          return { networkPlayers: newPlayers };
        });
      });

      room.state.projectiles.onAdd((proj, projId) => {
        set((state) => ({
          networkProjectiles: { ...state.networkProjectiles, [projId]: proj }
        }));
      });

      room.state.projectiles.onRemove((proj, projId) => {
        set((state) => {
          const newProjs = { ...state.networkProjectiles };
          delete newProjs[projId];
          return { networkProjectiles: newProjs };
        });
      });
      
      room.onMessage("player_died", (msg) => {
        console.log(`Player ${msg.id} died`);
        // Real game would dispatch an explosion state here
      });

      room.onLeave(() => {
        set({ room: null, connectionStatus: 'disconnected', networkPlayers: {}, networkProjectiles: {} });
      });

    } catch (e) {
      console.error('JOIN ERROR', e);
      set({ connectionStatus: 'error' });
    }
  },

  leaveBattle: () => {
    const { room } = get();
    if (room) {
      room.leave();
    }
    set({ room: null, connectionStatus: 'disconnected', networkPlayers: {}, networkProjectiles: {}, screen: 'mainMenu' });
  }
}));

export default useGameStore;
