import { TILES } from "../tiles.js";

export class FlatWorldGenerator {
  generate(world) {
    for (let y = world.minY; y < world.maxY; y++) {
      const id = y >= world.surfaceY ? TILES.DIRT.id : TILES.AIR.id;
      for (let x = world.minX; x < world.maxX; x++) {
        world.set(x, y, id);
      }
    }
  }
}
