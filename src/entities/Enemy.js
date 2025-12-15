import GameEntity from "./GameEntity.js";
import Sprite from "../../lib/Sprite.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import StateMachine from "../../lib/StateMachine.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import EnemyIdlingState from "../states/enemy/EnemyIdlingState.js";

export default class Enemy extends GameEntity {
  constructor(definition) {
    super({ ...definition, position: definition.position });

    this.position = new Vector(0, 0);

    this.dimensions = {
      x: definition.frameWidth,
      y: definition.frameHeight,
    };

    // Load the enemy image
    const image = images.get(definition.image);

    this.sprites = [
      new Sprite(image, 0, 0, definition.frameWidth, definition.frameHeight),
    ];

    // State machine
    this.stateMachine = new StateMachine();
    this.stateMachine.add("idling", new EnemyIdlingState(this));
    this.stateMachine.change("idling");
    this.currentAnimation = this.stateMachine.currentState.animation;

    // BATTLE STATS
    this.name = definition.name ?? "Enemy";
    this.maxHealth = definition.maxHealth ?? 60;
    this.currentHealth = this.maxHealth;
    this.attack = definition.attack ?? 15;
    this.defense = definition.defense ?? 5;
    this.moves = definition.moves ?? ["Strike"];
  }

  update(dt) {
    super.update(dt);
    this.stateMachine?.update(dt);
    this.currentAnimation?.update(dt);
  }

  render() {
    const x = Math.floor(this.position.x * 32);
    const y = Math.floor(this.position.y * 32 - this.dimensions.y / 2);

    this.sprites[0].render(x, y);
  }

  attack(move, target) {
    let damage = this.attack; // can customize by move later
    target.receiveDamage(damage);
  }

  receiveDamage(damage) {
    this.currentHealth -= damage;
    if (this.currentHealth < 0) this.currentHealth = 0;
  }
}
