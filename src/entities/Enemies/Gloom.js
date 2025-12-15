import Enemy from "../Enemy.js";

export default class Gloom extends Enemy {
  constructor() {
    super({
      image: "gloom-Idle",
      frameWidth: 256,
      frameHeight: 510,
      totalFrames: 2,
    });
  }
  voidBurst() {}
}
