import { Container, Sprite } from "pixi.js";

const VIEW_PADDING = 2;

export class WorldView {
  constructor(world, textures) {
    this.world = world;
    this.textures = textures;
    this.voxelSize = 1;
    this.container = new Container();
    this.pool = [];
    this.used = 0;
  }

  acquire() {
    if (this.used < this.pool.length) {
      const sprite = this.pool[this.used++];
      sprite.visible = true;
      return sprite;
    }

    const sprite = new Sprite();
    this.container.addChild(sprite);
    this.pool.push(sprite);
    this.used += 1;
    return sprite;
  }

  sync(camera) {
    const bounds = camera.visibleWorldBounds();
    const x0 = Math.max(this.world.minX, Math.floor(bounds.left) - VIEW_PADDING);
    const x1 = Math.min(this.world.maxX - 1, Math.ceil(bounds.right) + VIEW_PADDING);
    const y0 = Math.max(this.world.minY, Math.floor(bounds.top) - VIEW_PADDING);
    const y1 = Math.min(this.world.maxY - 1, Math.ceil(bounds.bottom) + VIEW_PADDING);

    this.used = 0;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const texture = this.textures.tiles[this.world.get(x, y)];
        if (!texture) {
          continue;
        }
        const sprite = this.acquire();
        sprite.texture = texture;
        sprite.width = this.voxelSize;
        sprite.height = this.voxelSize;
        sprite.x = x * this.voxelSize;
        sprite.y = y * this.voxelSize;
      }
    }

    for (let i = this.used; i < this.pool.length; i++) {
      this.pool[i].visible = false;
    }
  }
}
