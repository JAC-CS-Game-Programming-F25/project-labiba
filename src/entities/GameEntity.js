import Direction from "../enums/Direction.js";
import Tile from "../services/Tile.js";
import Vector from "../../lib/Vector.js";

export default class GameEntity {
  static WIDTH = 32;
  static HEIGHT = 48;

  /**
   * The base class to be extended by all entities in the game.
   * Right now we just have one Player character, but this could
   * be extended to implement NPCs (Non Player Characters) as well.
   *
   * @param {object} entityDefinition
   */
  constructor(entityDefinition = {}) {
    this.position = entityDefinition.position ?? new Vector();
    this.canvasPosition = new Vector(
      Math.floor(this.position.x * Tile.SIZE),
      Math.floor(this.position.y * Tile.SIZE)
    );
    this.dimensions = entityDefinition.dimensions ?? new Vector();
    this.direction = entityDefinition.direction ?? Direction.Down;
    this.stateMachine = null;
    this.currentFrame = 0;
    this.sprites = [];
  }

  /**
   * At this time, stateMachine will be null for Pokemon.
   */
  update(dt) {
    this.stateMachine?.update(dt);
  }

  render(x, y) {
    this.stateMachine?.render();
    this.sprites[this.currentFrame].render(x, y);
  }

  changeState(state, params) {
    this.stateMachine?.change(state, params);
  }
  //Get the tile right in front of the player
  getFacingTile() {
    switch (this.direction) {
      case Direction.Up:
        return new Vector(this.position.x, this.position.y - 1);
      case Direction.Down:
        return new Vector(this.position.x, this.position.y + 1);
      case Direction.Left:
        return new Vector(this.position.x - 1, this.position.y);
      case Direction.Right:
        return new Vector(this.position.x + 1, this.position.y);
    }
  }
  //To change the character to meet the player
  getOppositeDirection() {
    switch (this.direction) {
      case Direction.Up:
        return Direction.Down;
      case Direction.Down:
        return Direction.Up;
      case Direction.Left:
        return Direction.Right;
      case Direction.Right:
        return Direction.Left;
    }
  }
}
