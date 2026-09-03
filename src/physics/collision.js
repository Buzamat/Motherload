const EDGE = 1e-8;
const GROUND_PROBE = 0.02;

function overlappingTiles(bounds) {
  return {
    x0: Math.floor(bounds.left),
    x1: Math.floor(bounds.right - EDGE),
    y0: Math.floor(bounds.top),
    y1: Math.floor(bounds.bottom - EDGE),
  };
}

function collideAxis(player, world, axis) {
  const half = player.stats.size / 2;
  const bounds = player.bounds();
  const tiles = overlappingTiles(bounds);
  const velocity = axis === "x" ? player.vx : player.vy;

  let hit = null;
  for (let ty = tiles.y0; ty <= tiles.y1; ty++) {
    for (let tx = tiles.x0; tx <= tiles.x1; tx++) {
      if (!world.isSolid(tx, ty)) {
        continue;
      }
      if (axis === "x") {
        if (velocity > 0) {
          hit = hit === null ? tx : Math.min(hit, tx);
        } else if (velocity < 0) {
          hit = hit === null ? tx + 1 : Math.max(hit, tx + 1);
        }
      } else if (velocity > 0) {
        hit = hit === null ? ty : Math.min(hit, ty);
      } else if (velocity < 0) {
        hit = hit === null ? ty + 1 : Math.max(hit, ty + 1);
      }
    }
  }

  if (hit === null) {
    return;
  }

  if (axis === "x") {
    player.x = velocity > 0 ? hit - half : hit + half;
    player.vx = 0;
    return;
  }

  player.y = velocity > 0 ? hit - half : hit + half;
  player.vy = 0;
  if (velocity > 0) {
    player.grounded = true;
  }
}

export function groundTileY(player) {
  return Math.floor(player.bounds().bottom + GROUND_PROBE);
}

export function isGrounded(player, world) {
  const bounds = player.bounds();
  const probeY = Math.floor(bounds.bottom + GROUND_PROBE);
  if (probeY - bounds.bottom > GROUND_PROBE + EDGE) {
    return false;
  }

  const x0 = Math.floor(bounds.left + EDGE);
  const x1 = Math.floor(bounds.right - EDGE);
  for (let tx = x0; tx <= x1; tx++) {
    if (world.isSolid(tx, probeY)) {
      return true;
    }
  }
  return false;
}

export function integrateAndCollide(player, world, dt) {
  player.grounded = false;

  player.x += player.vx * dt;
  collideAxis(player, world, "x");

  player.y += player.vy * dt;
  collideAxis(player, world, "y");

  player.grounded = isGrounded(player, world);
  if (player.grounded && player.vy >= 0) {
    const half = player.stats.size / 2;
    const groundY = Math.floor(player.y + half + GROUND_PROBE);
    player.y = groundY - half;
  }
}
