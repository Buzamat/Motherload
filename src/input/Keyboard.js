export class Keyboard {
  constructor(bindings) {
    this.bindings = bindings;
    this.down = new Set();
    this.boundCodes = new Set(Object.values(bindings).flat());

    this.onDown = (event) => {
      if (this.boundCodes.has(event.code)) {
        event.preventDefault();
      }
      this.down.add(event.code);
    };
    this.onUp = (event) => {
      this.down.delete(event.code);
    };
    this.onBlur = () => {
      this.down.clear();
    };

    window.addEventListener("keydown", this.onDown);
    window.addEventListener("keyup", this.onUp);
    window.addEventListener("blur", this.onBlur);
  }

  isDown(action) {
    const codes = this.bindings[action] ?? [];
    return codes.some((code) => this.down.has(code));
  }

  axes() {
    const left = this.isDown("left");
    const right = this.isDown("right");
    const up = this.isDown("up");
    const down = this.isDown("down");

    return {
      x: (right ? 1 : 0) - (left ? 1 : 0),
      y: (down ? 1 : 0) - (up ? 1 : 0),
      up,
      down,
      left,
      right,
    };
  }
}
