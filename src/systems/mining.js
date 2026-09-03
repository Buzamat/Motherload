import { TILES } from "../world/tiles.js";
import { groundTileY } from "../physics/collision.js";

const EDGE = 1e-8;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function moveToward(value, target, amount) {
  if (value < target) {
    return Math.min(target, value + amount);
  }
  if (value > target) {
    return Math.max(target, value - amount);
  }
  return target;
}

function overlapRange(a0, a1, b0, b1) {
  return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
}

function snapIntoTileX(player, tileX) {
  const half = player.stats.size / 2;
  const buffer = player.stats.mineSnapBuffer;
  const minX = tileX + buffer + half;
  const maxX = tileX + 1 - buffer - half;
  player.x = clamp(player.x, minX, maxX);
}

function lockPlayer(player) {
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.wallContact = null;
}

function pickSolidTileAtX(player, world, tileX) {
  const bounds = player.bounds();
  const y0 = Math.floor(bounds.top);
  const y1 = Math.floor(bounds.bottom - EDGE);
  let best = null;
  let bestOverlap = 0;
  for (let tileY = y0; tileY <= y1; tileY++) {
    if (!world.inBounds(tileX, tileY) || !world.isSolid(tileX, tileY)) {
      continue;
    }
    const overlap = overlapRange(bounds.top, bounds.bottom, tileY, tileY + 1);
    if (overlap > bestOverlap) {
      best = { tileX, tileY };
      bestOverlap = overlap;
    }
  }
  return best;
}

export function findMineTarget(player, world) {
  if (!player.grounded || player.mining) {
    return null;
  }

  const bounds = player.bounds();
  const tileY = groundTileY(player);
  const minOverlap = player.stats.size * player.stats.mineOverlap;
  const x0 = Math.floor(bounds.left);
  const x1 = Math.floor(bounds.right - EDGE);

  let best = null;
  let bestOverlap = 0;
  for (let tileX = x0; tileX <= x1; tileX++) {
    if (!world.inBounds(tileX, tileY) || !world.isSolid(tileX, tileY)) {
      continue;
    }
    const overlap = overlapRange(bounds.left, bounds.right, tileX, tileX + 1);
    if (overlap >= minOverlap && overlap > bestOverlap) {
      best = { tileX, tileY, axis: "y" };
      bestOverlap = overlap;
    }
  }
  return best;
}

export function findHuggedWall(player, world, dir) {
  if (!player.grounded || player.mining || dir === 0) {
    return null;
  }

  const bounds = player.bounds();
  const hug = player.stats.mineHugBuffer;
  let tileX;
  let gap;

  if (dir > 0) {
    tileX = Math.floor(bounds.right + hug);
    gap = tileX - bounds.right;
  } else {
    tileX = Math.floor(bounds.left - hug);
    gap = bounds.left - (tileX + 1);
  }

  if (gap > hug || gap < -0.02) {
    return null;
  }

  const tile = pickSolidTileAtX(player, world, tileX);
  if (!tile) {
    return null;
  }
  return { ...tile, dir, axis: "x" };
}

export function startMining(player, target) {
  lockPlayer(player);

  if (target.axis === "x") {
    player.mining = {
      tileX: target.tileX,
      tileY: target.tileY,
      targetX: target.tileX + 0.5,
      targetY: player.y,
      axis: "x",
    };
    return;
  }

  snapIntoTileX(player, target.tileX);
  player.mining = {
    tileX: target.tileX,
    tileY: target.tileY,
    targetX: player.x,
    targetY: target.tileY + 0.5,
    axis: "y",
  };
}

export function updateMining(player, world, dt) {
  const job = player.mining;
  if (!job) {
    return;
  }

  lockPlayer(player);
  const step = player.stats.mineSpeed * dt;

  if (job.axis === "x") {
    player.y = job.targetY;
    player.x = moveToward(player.x, job.targetX, step);
    if (player.x !== job.targetX) {
      return;
    }
  } else {
    player.x = job.targetX;
    player.y = moveToward(player.y, job.targetY, step);
    if (player.y !== job.targetY) {
      return;
    }
  }

  world.set(job.tileX, job.tileY, TILES.AIR.id);
  player.mining = null;
}

export function tryStartDownMining(player, world) {
  const target = findMineTarget(player, world);
  if (!target) {
    return false;
  }
  startMining(player, target);
  return true;
}

export function updateWallContact(player, world, input, dt) {
  if (!player.grounded || player.mining) {
    player.wallContact = null;
    return false;
  }

  const pressed = input.x !== 0 ? findHuggedWall(player, world, input.x) : null;
  const hugged =
    pressed ??
    findHuggedWall(player, world, 1) ??
    findHuggedWall(player, world, -1);

  if (!hugged) {
    player.wallContact = null;
    return false;
  }

  const same =
    player.wallContact &&
    player.wallContact.tileX === hugged.tileX &&
    player.wallContact.tileY === hugged.tileY &&
    player.wallContact.dir === hugged.dir;

  if (!same) {
    player.wallContact = { ...hugged, elapsed: 0 };
  }

  if (Math.abs(player.vx) > 1e-6) {
    return false;
  }

  player.wallContact.elapsed += dt;

  const pressingIntoWall = input.x === hugged.dir;
  if (
    pressingIntoWall &&
    player.wallContact.elapsed >= player.stats.mineHugDelay - 1e-6
  ) {
    startMining(player, hugged);
    return true;
  }

  return false;
}
