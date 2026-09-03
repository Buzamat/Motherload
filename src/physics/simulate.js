import { applyHorizontal, applyVertical } from "./movement.js";
import { integrateAndCollide } from "./collision.js";
import { tryStartDownMining, updateMining, updateWallContact } from "../systems/mining.js";

export function stepPhysics(player, world, input, dt) {
  if (player.mining) {
    updateMining(player, world, dt);
    return;
  }

  if (input.down) {
    tryStartDownMining(player, world);
    if (player.mining) {
      return;
    }
  }

  applyHorizontal(player, input.x, dt);
  applyVertical(player, input, dt);
  integrateAndCollide(player, world, dt);

  if (!player.mining) {
    updateWallContact(player, world, input, dt);
  }
}
