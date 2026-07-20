import { RARITY } from './constants';

export const CHESTS = [
  {
    id: 'common',
    name: 'Common Chest',
    rarity: 'COMMON',
    cost: 500,
    color: RARITY.COMMON.color,
    glow: RARITY.COMMON.glow,
    loot: [
      { type: 'bp', min: 100, max: 500, chance: 0.7 },
      { type: 'tank', rarity: 'COMMON', chance: 0.25 },
      { type: 'xp', min: 50, max: 150, chance: 0.05 },
    ],
  },
  {
    id: 'super_rare',
    name: 'Super Rare Chest',
    rarity: 'SUPER_RARE',
    cost: 2000,
    color: RARITY.SUPER_RARE.color,
    glow: RARITY.SUPER_RARE.glow,
    loot: [
      { type: 'bp', min: 500, max: 2000, chance: 0.5 },
      { type: 'tank', rarity: 'RARE', chance: 0.3 },
      { type: 'tank', rarity: 'SUPER_RARE', chance: 0.1 },
      { type: 'xp', min: 200, max: 500, chance: 0.1 },
    ],
  },
  {
    id: 'epic',
    name: 'Epic Chest',
    rarity: 'EPIC',
    cost: 5000,
    color: RARITY.EPIC.color,
    glow: RARITY.EPIC.glow,
    loot: [
      { type: 'bp', min: 2000, max: 5000, chance: 0.4 },
      { type: 'tank', rarity: 'SUPER_RARE', chance: 0.25 },
      { type: 'tank', rarity: 'EPIC', chance: 0.2 },
      { type: 'xp', min: 500, max: 1000, chance: 0.15 },
    ],
  },
  {
    id: 'mythic',
    name: 'Mythic Chest',
    rarity: 'MYTHIC',
    cost: 15000,
    color: RARITY.MYTHIC.color,
    glow: RARITY.MYTHIC.glow,
    loot: [
      { type: 'bp', min: 5000, max: 15000, chance: 0.35 },
      { type: 'tank', rarity: 'EPIC', chance: 0.25 },
      { type: 'tank', rarity: 'MYTHIC', chance: 0.2 },
      { type: 'camo', chance: 0.1 },
      { type: 'xp', min: 1000, max: 3000, chance: 0.1 },
    ],
  },
  {
    id: 'legendary',
    name: 'Legendary Chest',
    rarity: 'LEGENDARY',
    cost: 40000,
    color: RARITY.LEGENDARY.color,
    glow: RARITY.LEGENDARY.glow,
    loot: [
      { type: 'bp', min: 15000, max: 40000, chance: 0.3 },
      { type: 'tank', rarity: 'MYTHIC', chance: 0.25 },
      { type: 'tank', rarity: 'LEGENDARY', chance: 0.2 },
      { type: 'camo', chance: 0.15 },
      { type: 'xp', min: 3000, max: 8000, chance: 0.1 },
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate Chest',
    rarity: 'ULTIMATE',
    cost: 100000,
    color: RARITY.ULTIMATE.color,
    glow: RARITY.ULTIMATE.glow,
    loot: [
      { type: 'bp', min: 50000, max: 100000, chance: 0.25 },
      { type: 'tank', rarity: 'LEGENDARY', chance: 0.3 },
      { type: 'tank', rarity: 'ULTIMATE', chance: 0.15 },
      { type: 'camo', chance: 0.15 },
      { type: 'xp', min: 10000, max: 25000, chance: 0.15 },
    ],
  },
];

export function getChestById(id) {
  return CHESTS.find(c => c.id === id);
}

export function rollChest(chest) {
  const roll = Math.random();
  let cumulative = 0;
  for (const item of chest.loot) {
    cumulative += item.chance;
    if (roll <= cumulative) {
      if (item.type === 'bp' || item.type === 'xp') {
        return {
          type: item.type,
          amount: Math.floor(Math.random() * (item.max - item.min + 1)) + item.min,
        };
      }
      return { type: item.type, rarity: item.rarity || null };
    }
  }
  return { type: 'bp', amount: chest.loot[0].min };
}

export default CHESTS;
