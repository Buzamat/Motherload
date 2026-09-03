import { TILES, getTileDef } from "./tiles.js";

export class World {
  constructor(config, generator) {
    this.width = config.width;
    this.skyHeight = config.skyHeight;
    this.groundDepth = config.groundDepth;
    this.surfaceY = config.surfaceY;
    this.minX = 0;
    this.maxX = config.width;
    this.minY = config.surfaceY - config.skyHeight;
    this.maxY = config.surfaceY + config.groundDepth;
    this.generator = generator;
    this.tiles = new Uint8Array(this.width * (this.maxY - this.minY));
  }

  generate() {
    this.generator.generate(this);
  }

  index(x, y) {
    return (y - this.minY) * this.width + x;
  }

  inBounds(x, y) {
    return x >= this.minX && x < this.maxX && y >= this.minY && y < this.maxY;
  }

  get(x, y) {
    if (!this.inBounds(x, y)) {
      return TILES.AIR.id;
    }
    return this.tiles[this.index(x, y)];
  }

  set(x, y, id) {
    if (!this.inBounds(x, y)) {
      return;
    }
    this.tiles[this.index(x, y)] = id;
  }

  isSolid(x, y) {
    if (!this.inBounds(x, y)) {
      return true;
    }
    return getTileDef(this.tiles[this.index(x, y)]).solid;
  }
}
