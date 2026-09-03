import { Sprite } from "pixi.js";
import { borderWidth } from "./textures.js";

export class PlayerView {
  constructor(texture) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.container = this.sprite;
    this.voxelSize = 1;
  }

  setTexture(texture) {
    this.sprite.texture = texture;
    this.sprite.scale.set(1);
  }

  setVoxelSize(voxelSize) {
    this.voxelSize = voxelSize;
  }

  sync(player) {
    const playerPx = this.sprite.texture.height;
    const seam = borderWidth(playerPx) + borderWidth(this.voxelSize);
    this.sprite.x = player.x * this.voxelSize;
    this.sprite.y = player.y * this.voxelSize + (player.grounded && !player.mining ? seam : 0);
  }
}
