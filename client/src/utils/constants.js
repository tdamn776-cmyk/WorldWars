export const GAME_CONFIG = {
  TITLE: 'WorldWars',
  VERSION: '1.0.0',
  MAX_LEVEL: 100,
  MIN_AGE: 13,
  MATCH_DURATION: 180,
  MAX_PLAYERS_PER_ROOM: 4,
  TICK_RATE: 20,
  TERRAIN_SIZE: 200,
  TERRAIN_SEGMENTS: 128,
  GRAVITY: -30,
};

export const REWARDS = {
  WIN_BP: 200,
  LOSE_BP: 50,
  KILL_BP: 100,
  WIN_XP: 100,
  LOSE_XP: 30,
  KILL_XP: 50,
};

export const RARITY = {
  COMMON: { name: 'Common', color: '#aaaacc', glow: 'rgba(170,170,204,0.4)' },
  RARE: { name: 'Rare', color: '#3b8bff', glow: 'rgba(59,139,255,0.4)' },
  SUPER_RARE: { name: 'Super Rare', color: '#6c5ce7', glow: 'rgba(108,92,231,0.4)' },
  EPIC: { name: 'Epic', color: '#b44cff', glow: 'rgba(180,76,255,0.4)' },
  MYTHIC: { name: 'Mythic', color: '#ff3b8b', glow: 'rgba(255,59,139,0.4)' },
  LEGENDARY: { name: 'Legendary', color: '#ffa500', glow: 'rgba(255,165,0,0.4)' },
  ULTIMATE: { name: 'Ultimate', color: '#ff3b3b', glow: 'rgba(255,59,59,0.5)' },
};

export const PROJECTILE_TYPES = {
  SHELL: 'shell',
  ROCKET: 'rocket',
  BULLET: 'bullet',
  SNIPER: 'sniper',
  LASER: 'laser',
  FLAME: 'flame',
  PLASMA: 'plasma',
  EMP: 'emp',
};

export const CAMO_PATTERNS = {
  NONE: 'none',
  FOREST: 'forest',
  DESERT: 'desert',
  URBAN: 'urban',
  ARCTIC: 'arctic',
  DIGITAL: 'digital',
  LAVA: 'lava',
  OCEAN: 'ocean',
};

export const TANK_CLASSES = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  ARTILLERY: 'artillery',
  SNIPER: 'sniper',
  ROCKET: 'rocket',
  MACHINE_GUN: 'machine_gun',
  SPECIAL: 'special',
  LEGENDARY: 'legendary',
  ULTIMATE: 'ultimate',
};

export const MAPS = [
  { id: 'forest', name: 'Green Valley', groundColor: '#2d5a1e', skyColor: '#87CEEB' },
  { id: 'desert', name: 'Scorching Dunes', groundColor: '#c4a35a', skyColor: '#f5deb3' },
  { id: 'arctic', name: 'Frozen Wastes', groundColor: '#dce6f0', skyColor: '#b0c4de' },
  { id: 'volcano', name: 'Inferno Ridge', groundColor: '#3a1a0a', skyColor: '#2a0a0a' },
  { id: 'city', name: 'Urban Warfare', groundColor: '#555555', skyColor: '#708090' },
];

export const ADMIN_SECRET = 'WORLDWARS_ADMIN_2024';
