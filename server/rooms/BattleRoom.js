const { Room } = require('colyseus');
const { GameState, Player, Projectile } = require('../schema/GameState');

class BattleRoom extends Room {
  onCreate(options) {
    this.maxClients = 10;
    this.setState(new GameState());

    // Message handler for player movement sync
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
        player.rotY = data.rotY;
        player.turretRot = data.turretRot;
      }
    });

    // Message handler for shooting
    this.onMessage("shoot", (client, data) => {
      const projId = data.id || Math.random().toString(36).substr(2, 9);
      const proj = new Projectile();
      proj.x = data.x;
      proj.y = data.y;
      proj.z = data.z;
      proj.dirX = data.dirX;
      proj.dirZ = data.dirZ;
      proj.speed = data.speed;
      proj.type = data.type;
      proj.ownerId = client.sessionId;
      
      this.state.projectiles.set(projId, proj);

      // Auto remove projectile after 3 seconds to avoid memory leaks
      setTimeout(() => {
        if (this.state.projectiles.has(projId)) {
          this.state.projectiles.delete(projId);
        }
      }, 3000);
    });

    // Basic hit detection (authoritative check done by whoever registers the hit)
    this.onMessage("hit", (client, data) => {
      const { targetId, damage, projectileId } = data;
      
      const target = this.state.players.get(targetId);
      if (target) {
        target.hp -= damage;
        
        if (target.hp <= 0) {
          target.deaths += 1;
          
          // Reward the killer
          const killer = this.state.players.get(client.sessionId);
          if (killer) {
            killer.kills += 1;
          }
          
          // Respawn target
          setTimeout(() => {
            if (this.state.players.has(targetId)) {
              const p = this.state.players.get(targetId);
              p.hp = p.maxHp;
              p.x = Math.random() * 40 - 20;
              p.z = Math.random() * 40 - 20;
            }
          }, 3000);
          
          // Broadcast death event
          this.broadcast("player_died", { id: targetId, killedBy: client.sessionId });
        }
      }
      
      if (this.state.projectiles.has(projectileId)) {
        this.state.projectiles.delete(projectileId);
      }
    });
  }

  onJoin(client, options) {
    const player = new Player();
    player.username = options.username || "Guest";
    player.tankId = options.tankId || "recruit";
    
    // Quick random spawn
    player.x = (Math.random() - 0.5) * 30;
    player.z = (Math.random() - 0.5) * 30;
    player.hp = options.hp || 1000;
    player.maxHp = options.hp || 1000;

    this.state.players.set(client.sessionId, player);
    console.log(`[JOIN] ${player.username} joined (${client.sessionId})`);
  }

  onLeave(client, consented) {
    console.log(`[LEAVE] ${client.sessionId}`);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("Room disposed");
  }
}

module.exports = { BattleRoom };
