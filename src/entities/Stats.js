export class Stats {
  constructor(config) {
    this.size = config.size;
    this.minSpeed = config.minSpeed;
    this.maxSpeed = config.maxSpeed;
    this.accelDuration = config.accelDuration;
    this.slideDuration = config.slideDuration;
    this.slowSlideBoost = config.slowSlideBoost;
    this.groundSlideMultiplier = config.groundSlideMultiplier;
    this.airMaxSpeed = config.airMaxSpeed;
    this.airAccelDuration = config.airAccelDuration;
    this.airSlideDuration = config.airSlideDuration;
    this.gravity = config.gravity;
    this.maxFallSpeed = config.maxFallSpeed;
    this.breakPower = config.breakPower;
    this.mineSpeed = config.mineSpeed;
    this.mineOverlap = config.mineOverlap;
    this.mineSnapBuffer = config.mineSnapBuffer;
    this.mineHugBuffer = config.mineHugBuffer;
    this.mineHugDelay = config.mineHugDelay;
    this.flyMaxSpeed = config.flyMaxSpeed;
    this.flyAccelDuration = config.flyAccelDuration;
    this.carryCapacity = config.carryCapacity;
    this.health = config.health;
    this.maxHealth = config.maxHealth;
  }

  get moveAcceleration() {
    return (this.maxSpeed - this.minSpeed) / this.accelDuration;
  }

  get moveDeceleration() {
    return this.maxSpeed / this.slideDuration;
  }

  get flyAcceleration() {
    return this.flyMaxSpeed / this.flyAccelDuration;
  }

  get airAcceleration() {
    return (this.airMaxSpeed - this.minSpeed) / this.airAccelDuration;
  }

  get airDeceleration() {
    return this.airMaxSpeed / this.airSlideDuration;
  }

  currentMaxSpeed(grounded) {
    return grounded ? this.maxSpeed : this.airMaxSpeed;
  }

  currentAcceleration(grounded) {
    return grounded ? this.moveAcceleration : this.airAcceleration;
  }
}
