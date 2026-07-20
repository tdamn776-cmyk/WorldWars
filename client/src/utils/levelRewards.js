const LEVEL_REWARDS = [];

function calcXpForLevel(level) {
  if (level <= 10) return Math.floor(80 * level + 20 * level * level);
  if (level <= 30) return Math.floor(200 * level + 50 * level);
  if (level <= 60) return Math.floor(500 * level + 100 * level);
  return Math.floor(1000 * level + 200 * level);
}

for (let i = 1; i <= 100; i++) {
  const reward = {
    level: i,
    xpRequired: calcXpForLevel(i),
    rewards: [],
  };

  reward.rewards.push({ type: 'bp', amount: i * 100 });

  if (i % 5 === 0) {
    reward.rewards.push({ type: 'chest', chestId: 'common' });
  }
  if (i % 10 === 0) {
    reward.rewards.push({ type: 'chest', chestId: 'super_rare' });
  }
  if (i === 15) {
    reward.rewards.push({ type: 'tank', tankId: 'guardian' });
  }
  if (i === 20) {
    reward.rewards.push({ type: 'chest', chestId: 'epic' });
  }
  if (i === 25) {
    reward.rewards.push({ type: 'tank', tankId: 'howitzer' });
  }
  if (i === 30) {
    reward.rewards.push({ type: 'chest', chestId: 'epic' });
    reward.rewards.push({ type: 'bp', amount: 5000 });
  }
  if (i === 35) {
    reward.rewards.push({ type: 'tank', tankId: 'mammoth' });
  }
  if (i === 40) {
    reward.rewards.push({ type: 'chest', chestId: 'mythic' });
  }
  if (i === 45) {
    reward.rewards.push({ type: 'tank', tankId: 'annihilator' });
  }
  if (i === 50) {
    reward.rewards.push({ type: 'chest', chestId: 'mythic' });
    reward.rewards.push({ type: 'bp', amount: 50000 });
  }
  if (i === 55) {
    reward.rewards.push({ type: 'tank', tankId: 'dragon' });
  }
  if (i === 60) {
    reward.rewards.push({ type: 'chest', chestId: 'legendary' });
  }
  if (i === 65) {
    reward.rewards.push({ type: 'tank', tankId: 'valkyrie' });
  }
  if (i === 70) {
    reward.rewards.push({ type: 'tank', tankId: 'odin' });
    reward.rewards.push({ type: 'chest', chestId: 'legendary' });
  }
  if (i === 75) {
    reward.rewards.push({ type: 'chest', chestId: 'legendary' });
    reward.rewards.push({ type: 'bp', amount: 100000 });
  }
  if (i === 80) {
    reward.rewards.push({ type: 'tank', tankId: 'worldbreaker' });
  }
  if (i === 90) {
    reward.rewards.push({ type: 'chest', chestId: 'ultimate' });
  }
  if (i === 100) {
    reward.rewards.push({ type: 'tank', tankId: 'apocalypse' });
    reward.rewards.push({ type: 'chest', chestId: 'ultimate' });
    reward.rewards.push({ type: 'bp', amount: 500000 });
  }

  LEVEL_REWARDS.push(reward);
}

export function getRewardsForLevel(level) {
  return LEVEL_REWARDS.find(r => r.level === level);
}

export function getXpForLevel(level) {
  const lr = LEVEL_REWARDS.find(r => r.level === level);
  return lr ? lr.xpRequired : Infinity;
}

export function calculateLevel(totalXp) {
  let level = 1;
  let remaining = totalXp;
  for (const lr of LEVEL_REWARDS) {
    if (remaining >= lr.xpRequired) {
      remaining -= lr.xpRequired;
      level = lr.level + 1;
    } else {
      break;
    }
  }
  return Math.min(level, 100);
}

export default LEVEL_REWARDS;
