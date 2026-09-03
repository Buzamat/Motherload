export const CONFIG = {
  colors: {
    sky: 0x7ec8e3,
    player: 0xf4d35e,
    playerBorder: 0xb86b2a,
  },

  world: {
    width: 200,
    skyHeight: 50,
    groundDepth: 550,
    surfaceY: 0,
    spawnX: 100,
  },

  player: {
    size: 0.75,
    minSpeed: 0.2,
    maxSpeed: 2,
    accelDuration: 1,
    slideDuration: 1.25,
    slowSlideBoost: 3,
    groundSlideMultiplier: 1.5,
    airMaxSpeed: 4,
    airAccelDuration: 0.4,
    airSlideDuration: 5,
    gravity: 4.5,
    maxFallSpeed: 5,
    flyMaxSpeed: 3,
    flyAccelDuration: 0.22,
    breakPower: 0,
    mineSpeed: 2.5,
    mineOverlap: 0.75,
    mineSnapBuffer: 0.05,
    mineHugBuffer: 0.05,
    mineHugDelay: 0.2,
    carryCapacity: 0,
    health: 100,
    maxHealth: 100,
  },

  camera: {
    viewWidth: 15,
    viewHeight: 13,
    followDuration: 0.14,
  },

  controls: {
    left: ["KeyA", "ArrowLeft"],
    right: ["KeyD", "ArrowRight"],
    up: ["KeyW", "ArrowUp"],
    down: ["KeyS", "ArrowDown"],
  },
};
