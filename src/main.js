import "./style.css";
import { Game } from "./game/Game.js";

try {
  const game = new Game(document.body);
  await game.start();
} catch (error) {
  const el = document.createElement("pre");
  el.textContent = error?.stack ?? String(error);
  el.style.cssText =
    "position:fixed;inset:16px;color:#f88;background:#200;padding:16px;overflow:auto;z-index:10";
  document.body.appendChild(el);
  throw error;
}
