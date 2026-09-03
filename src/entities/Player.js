import { Stats } from "./Stats.js";

export class Player {
  constructor(statConfig) {
    this.stats = new Stats(statConfig);
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.mining = null;
    this.wallContact = null;
    this.inventory = [];
  }

  spawnAt(x, surfaceY) {
    this.x = x;
    this.y = surfaceY - this.stats.size / 2;
    this.vx = 0;
    this.vy = 0;
    this.grounded = true;
    this.mining = null;
    this.wallContact = null;
  }

  bounds() {
    const half = this.stats.size / 2;
    return {
      left: this.x - half,
      right: this.x + half,
      top: this.y - half,
      bottom: this.y + half,
    };
  }
}
