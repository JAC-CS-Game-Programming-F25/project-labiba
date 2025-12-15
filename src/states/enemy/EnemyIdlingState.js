import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";

export default class EnemyIdlingState extends State {
  constructor(enemy) {
    super();

    this.enemy = enemy;
    this.animation = new Animation([0], 1);
  }

  enter() {
    // Set the enemy's current animation to idle
    this.enemy.currentAnimation = this.animation;
  }

  update(dt) {
    // Update the animation frame (even if single frame)
    this.enemy.currentAnimation.update(dt);
  }
}
