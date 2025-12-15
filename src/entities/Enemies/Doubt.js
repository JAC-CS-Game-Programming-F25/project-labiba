import Enemy from "../Enemy.js";

export default class Doubt extends Enemy {
  constructor() {
    super({
      image: "doubt-Idle",
      frameWidth: 256,
      frameHeight: 1785, // total height of vertical sprite sheet
      totalFrames: 7, // 1785 / 256 ≈ 7 frames
    });
  }

  roarShockwave() {}
}
