const { Schema, MapSchema, type } = require('@colyseus/schema');

class Player extends Schema {
  constructor() {
    super();
    this.x = 0;
    this.y = 1;
    this.z = 0;
    this.rotY = 0;
    
    this.turretRot = 0;
    
    this.username = "Player";
    this.tankId = "recruit";
    this.hp = 1000;
    this.maxHp = 1000;
    this.kills = 0;
    this.deaths = 0;
  }
}
type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");
type("number")(Player.prototype, "z");
type("number")(Player.prototype, "rotY");
type("number")(Player.prototype, "turretRot");
type("string")(Player.prototype, "username");
type("string")(Player.prototype, "tankId");
type("number")(Player.prototype, "hp");
type("number")(Player.prototype, "maxHp");
type("number")(Player.prototype, "kills");
type("number")(Player.prototype, "deaths");

class Projectile extends Schema {
  constructor() {
    super();
    this.x = 0;
    this.y = 1.5;
    this.z = 0;
    this.dirX = 0;
    this.dirZ = 0;
    this.speed = 60;
    this.type = "shell";
    this.ownerId = "";
  }
}
type("number")(Projectile.prototype, "x");
type("number")(Projectile.prototype, "y");
type("number")(Projectile.prototype, "z");
type("number")(Projectile.prototype, "dirX");
type("number")(Projectile.prototype, "dirZ");
type("number")(Projectile.prototype, "speed");
type("string")(Projectile.prototype, "type");
type("string")(Projectile.prototype, "ownerId");

class GameState extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
    this.projectiles = new MapSchema();
  }
}
type({ map: Player })(GameState.prototype, "players");
type({ map: Projectile })(GameState.prototype, "projectiles");

module.exports = { GameState, Player, Projectile };
