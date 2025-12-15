import GameEntity from "./GameEntity.js";
import { images, stateStack } from "../globals.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerIdlingState from "../states/player/PlayerIdlingState.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import { pickRandomElement } from "../../lib/Random.js";
import Character from "../enums/Character.js";
import Map from "../services/Map.js";
import VictoryState from "../states/game/VictoryState.js";
import TransitionState from "../states/game/TransitionState.js";

export default class Player extends GameEntity {
  /**
   * The character that the player controls in the map.
   * Has a party of Pokemon they can use to battle other Pokemon.
   *
   * @param {object} entityDefinition
   * @param {Map} map
   */
  constructor(entityDefinition = {}, map) {
    super(entityDefinition);

    this.map = map;
    this.dimensions = new Vector(GameEntity.WIDTH, GameEntity.HEIGHT);
    this.stateMachine = this.initializeStateMachine();
    this.sprites = this.initializeSprites();
    this.currentAnimation =
      this.stateMachine.currentState.animation[this.direction];

    // BATTLE STATS
    this.name = "Aki";
    this.maxHealth = 100;
    this.currentHealth = this.maxHealth;
    this.attack = 20;
    this.defense = 10;
    this.moves = ["Encouragement", "Hit", "Cry", "Insult"];
    this.inventory = [];
    this.fragments = [];
    this.fragmentsCollected = 0;
  }

  update(dt) {
    super.update(dt);
    this.currentAnimation.update(dt);

    this.currentFrame = this.currentAnimation.getCurrentFrame();
  }

  render() {
    const x = Math.floor(this.canvasPosition.x);

    /**
     * Offset the Y coordinate to provide a more "accurate" visual.
     * To see the difference, remove the offset and bump into something
     * either above or below the character and you'll see why this is here.
     */
    const y = Math.floor(this.canvasPosition.y - this.dimensions.y / 2);

    super.render(x, y);
  }

  initializeStateMachine() {
    const stateMachine = new StateMachine();

    stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
    stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));

    stateMachine.change(PlayerStateName.Idling);

    return stateMachine;
  }

  initializeSprites() {
    const character = pickRandomElement([Character.May]);

    return Sprite.generateSpritesFromSpriteSheet(
      images.get(character),
      GameEntity.WIDTH,
      GameEntity.HEIGHT
    );
  }
  collectFragment(fragmentId) {
    if (!this.fragments.includes(fragmentId)) {
      this.fragments.push(fragmentId);
      console.log(`Fragment ${fragmentId} collected!`);
      this.fragmentsCollected++;
    }
  }

  useItem(item) {}

  addToInventory(item) {}
}
