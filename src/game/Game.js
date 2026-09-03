import { Application, Container, Graphics } from "pixi.js";
import { CONFIG } from "../config.js";
import { Keyboard } from "../input/Keyboard.js";
import { World } from "../world/World.js";
import { FlatWorldGenerator } from "../world/generators/FlatWorldGenerator.js";
import { Player } from "../entities/Player.js";
import { stepPhysics } from "../physics/simulate.js";
import { createTextures } from "../render/textures.js";
import { Camera } from "../render/Camera.js";
import { WorldView } from "../render/WorldView.js";
import { PlayerView } from "../render/PlayerView.js";

const MAX_DT = 1 / 20;
const LETTERBOX = 0x10161c;

export class Game {
  constructor(mount) {
    this.mount = mount;
    this.app = null;
    this.world = null;
    this.player = null;
    this.keyboard = null;
    this.camera = null;
    this.worldView = null;
    this.playerView = null;
    this.playfield = null;
    this.sky = null;
    this.clip = null;
  }

  async start() {
    const app = new Application();
    const width = Math.max(1, window.innerWidth || 1280);
    const height = Math.max(1, window.innerHeight || 720);

    await Promise.race([
      app.init({
        preference: ["canvas"],
        background: LETTERBOX,
        width,
        height,
        antialias: false,
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Game renderer failed to start")), 5000);
      }),
    ]);

    this.mount.appendChild(app.canvas);
    app.canvas.style.display = "block";
    app.resizeTo = window;
    this.app = app;

    const world = new World(CONFIG.world, new FlatWorldGenerator());
    world.generate();

    const player = new Player(CONFIG.player);
    player.spawnAt(CONFIG.world.spawnX, CONFIG.world.surfaceY);

    const keyboard = new Keyboard(CONFIG.controls);
    const textures = createTextures(1, CONFIG);

    const playfield = new Container();
    const sky = new Graphics();
    const worldLayer = new Container();
    const clip = new Graphics();
    playfield.addChild(sky);
    playfield.addChild(worldLayer);
    playfield.addChild(clip);
    playfield.mask = clip;
    app.stage.addChild(playfield);

    const worldView = new WorldView(world, textures);
    const playerView = new PlayerView(textures.player);
    worldLayer.addChild(worldView.container);
    worldLayer.addChild(playerView.container);

    const camera = new Camera(worldLayer, app.renderer, CONFIG);

    this.world = world;
    this.player = player;
    this.keyboard = keyboard;
    this.camera = camera;
    this.worldView = worldView;
    this.playerView = playerView;
    this.playfield = playfield;
    this.sky = sky;
    this.clip = clip;
    this.textures = textures;

    this.fitCamera();

    app.renderer.on("resize", () => {
      this.fitCamera();
    });
    window.addEventListener("resize", () => {
      this.fitCamera();
    });

    app.ticker.add((ticker) => {
      this.update(Math.min(ticker.deltaMS / 1000, MAX_DT));
    });
  }

  fitCamera() {
    this.camera.refreshViewport();
    const width = this.camera.frameWidth;
    const height = this.camera.frameHeight;
    const screen = this.app.renderer.screen;

    this.playfield.x = Math.round((screen.width - width) / 2);
    this.playfield.y = Math.round((screen.height - height) / 2);

    this.sky.clear();
    this.sky.rect(0, 0, width, height);
    this.sky.fill(CONFIG.colors.sky);

    this.clip.clear();
    this.clip.rect(0, 0, width, height);
    this.clip.fill(0xffffff);

    this.worldView.voxelSize = this.camera.voxelSize;
    this.playerView.setVoxelSize(this.camera.voxelSize);
    this.textures = createTextures(this.camera.voxelSize, CONFIG);
    this.worldView.textures = this.textures;
    this.playerView.setTexture(this.textures.player);
    this.camera.snapTo(this.player.x, this.player.y);
    this.worldView.sync(this.camera);
    this.playerView.sync(this.player);
  }

  update(dt) {
    const input = this.keyboard.axes();
    stepPhysics(this.player, this.world, input, dt);
    this.playerView.sync(this.player);
    this.camera.follow(this.player.x, this.player.y);
    this.worldView.sync(this.camera);
  }
}
