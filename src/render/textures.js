import { Texture } from "pixi.js";
import { TILES } from "../world/tiles.js";

function cssHex(color) {
  return `#${color.toString(16).padStart(6, "0")}`;
}

export function borderWidth(size) {
  return Math.max(1, Math.round(size * 0.04));
}

function squareTexture(size, fill, border) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, size, size);
  const stroke = borderWidth(size);
  ctx.fillStyle = border;
  ctx.fillRect(0, 0, size, stroke);
  ctx.fillRect(0, size - stroke, size, stroke);
  ctx.fillRect(0, 0, stroke, size);
  ctx.fillRect(size - stroke, 0, stroke, size);
  const texture = Texture.from(canvas);
  texture.source.scaleMode = "nearest";
  return texture;
}

export function createTextures(voxelSize, config) {
  const tiles = [];
  for (const tile of Object.values(TILES)) {
    if (!tile.visible) {
      continue;
    }
    tiles[tile.id] = squareTexture(
      voxelSize,
      cssHex(tile.color),
      cssHex(tile.border),
    );
  }

  const playerSize = Math.round(config.player.size * voxelSize);
  return {
    tiles,
    player: squareTexture(
      playerSize,
      cssHex(config.colors.player),
      cssHex(config.colors.playerBorder),
    ),
  };
}
