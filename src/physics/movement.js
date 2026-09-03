function towardZero(value, amount) {
  if (value > 0) {
    return Math.max(0, value - amount);
  }
  if (value < 0) {
    return Math.min(0, value + amount);
  }
  return 0;
}

export function applyThrust(velocity, direction, minSpeed, maxSpeed, acceleration, dt) {
  if (direction === 0) {
    return velocity;
  }

  if (direction > 0) {
    if (velocity > maxSpeed) {
      return velocity;
    }
    if (velocity >= 0 && velocity < minSpeed) {
      velocity = minSpeed;
    }
    return Math.min(maxSpeed, velocity + acceleration * dt);
  }

  if (velocity < -maxSpeed) {
    return velocity;
  }
  if (velocity <= 0 && velocity > -minSpeed) {
    velocity = -minSpeed;
  }
  return Math.max(-maxSpeed, velocity - acceleration * dt);
}

export function slideDeceleration(player) {
  const stats = player.stats;
  if (!player.grounded) {
    return stats.airDeceleration;
  }

  const ratio = stats.maxSpeed <= 0 ? 0 : Math.min(1, Math.abs(player.vx) / stats.maxSpeed);
  const lowSpeed = 1 + (1 - ratio) * stats.slowSlideBoost;
  return stats.moveDeceleration * lowSpeed * stats.groundSlideMultiplier;
}

function reverseToward(player, inputX, stopRate, minSpeed, maxSpeed, acceleration, dt) {
  const previous = player.vx;
  player.vx = towardZero(player.vx, stopRate * dt);
  if (player.vx !== 0) {
    return;
  }

  const used = stopRate <= 0 ? dt : Math.abs(previous) / stopRate;
  const remain = Math.max(0, dt - used);
  if (remain > 0) {
    player.vx = applyThrust(0, inputX, minSpeed, maxSpeed, acceleration, remain);
  }
}

export function applyHorizontal(player, inputX, dt) {
  const stats = player.stats;
  const maxSpeed = stats.currentMaxSpeed(player.grounded);
  const acceleration = stats.currentAcceleration(player.grounded);
  const brake = slideDeceleration(player);

  if (inputX !== 0 && player.vx !== 0 && Math.sign(player.vx) !== inputX) {
    reverseToward(
      player,
      inputX,
      brake + acceleration,
      stats.minSpeed,
      maxSpeed,
      acceleration,
      dt,
    );
    return;
  }

  if (inputX === 0) {
    player.vx = towardZero(player.vx, brake * dt);
    return;
  }

  if (player.grounded && Math.abs(player.vx) > maxSpeed) {
    player.vx = towardZero(player.vx, brake * dt);
    if (Math.abs(player.vx) < maxSpeed) {
      player.vx = inputX * maxSpeed;
    }
    return;
  }

  player.vx = applyThrust(
    player.vx,
    inputX,
    stats.minSpeed,
    maxSpeed,
    acceleration,
    dt,
  );
}

export function applyVertical(player, input, dt) {
  const { gravity, maxFallSpeed, flyMaxSpeed, flyAcceleration } = player.stats;

  if (player.grounded && !input.up) {
    player.vy = 0;
    return;
  }

  if (!player.grounded) {
    player.vy += gravity * dt;
  }

  if (input.up) {
    player.vy -= flyAcceleration * dt;
  }

  player.vy = Math.min(maxFallSpeed, Math.max(-flyMaxSpeed, player.vy));
}
