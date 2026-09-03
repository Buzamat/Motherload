import gsap from "gsap";

export class Camera {
  constructor(target, renderer, config) {
    this.target = target;
    this.renderer = renderer;
    this.config = config;
    this.voxelSize = 1;
    this._cam = { x: 0, y: 0 };
    this._xTo = gsap.quickTo(this._cam, "x", {
      duration: config.camera.followDuration,
      ease: "power2.out",
    });
    this._yTo = gsap.quickTo(this._cam, "y", {
      duration: config.camera.followDuration,
      ease: "power2.out",
    });
    this.refreshViewport();
  }

  get screenWidth() {
    return this.renderer.screen.width;
  }

  get screenHeight() {
    return this.renderer.screen.height;
  }

  get frameWidth() {
    return this.config.camera.viewWidth * this.voxelSize;
  }

  get frameHeight() {
    return this.config.camera.viewHeight * this.voxelSize;
  }

  refreshViewport() {
    const { viewWidth, viewHeight } = this.config.camera;
    const raw = Math.min(this.screenWidth / viewWidth, this.screenHeight / viewHeight);
    this.voxelSize = Math.max(4, Math.floor(raw / 4) * 4);
  }

  screenFromWorld(worldX, worldY) {
    return {
      x: this.frameWidth / 2 - worldX * this.voxelSize,
      y: this.frameHeight / 2 - worldY * this.voxelSize,
    };
  }

  applyRounded() {
    this.target.x = Math.round(this._cam.x);
    this.target.y = Math.round(this._cam.y);
  }

  snapTo(worldX, worldY) {
    const pos = this.screenFromWorld(worldX, worldY);
    this._cam.x = pos.x;
    this._cam.y = pos.y;
    this.applyRounded();
  }

  follow(worldX, worldY) {
    const pos = this.screenFromWorld(worldX, worldY);
    this._xTo(pos.x);
    this._yTo(pos.y);
    this.applyRounded();
  }

  visibleWorldBounds() {
    const left = -this.target.x / this.voxelSize;
    const top = -this.target.y / this.voxelSize;
    return {
      left,
      top,
      right: left + this.config.camera.viewWidth,
      bottom: top + this.config.camera.viewHeight,
    };
  }
}
