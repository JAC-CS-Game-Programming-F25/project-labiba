import Enemy from "../Enemy.js";

export default class Anxiety extends Enemy {
  constructor() {
    super({
      image: "anxiety-Idle",
      frameWidth: 256,
      frameHeight: 1020,
      totalFrames: 4,
    });
    this.isImortal = true;
  }
  specialAttack() {}
}
