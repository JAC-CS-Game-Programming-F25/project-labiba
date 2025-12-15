import Input from "../../lib/Input.js";
import Vector from "../../lib/Vector.js";
import GameEntity from "../entities/GameEntity.js";
import Player from "../entities/Player.js";
import Direction from "../enums/Direction.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import SoundName from "../enums/SoundName.js";
import { canvas, input, sounds, timer } from "../globals.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";

export default class Exit {
  constructor(exitDefinition) {
    this.location = new Vector(
      exitDefinition.location.x,
      exitDefinition.location.y
    );
    this.destinationMap = exitDefinition.destinationMap;
    this.destinationDirection = this.getDirection(
      exitDefinition.destinationDirection
    );
    this.destinationTile = new Vector(
      exitDefinition.destinationTile.x,
      exitDefinition.destinationTile.y
    );
    this.enterDirection = this.getDirection(exitDefinition.enterDirection);
    this.inTransition = exitDefinition.inTransition;
    this.outTransition = exitDefinition.outTransition;
  }

  /**
   * Get a Direction enum value from a string.
   * @param {string} direction
   */
  getDirection(direction) {
    switch (direction.toLowerCase()) {
      case "up":
        return Direction.Up;
      case "down":
        return Direction.Down;
      case "left":
        return Direction.Left;
      case "right":
        return Direction.Right;
    }
  }

  /**
   * Determine whether an entity is standing on the warp's location tile.
   * @param {GameEntity} entity
   */
  isEntityOnExitTile(entity) {
    return (
      entity.position.x === this.location.x &&
      entity.position.y === this.location.y
    );
  }

  /**
   * Determine whether the player is pressing the key activate the warp, based on the warp's enter direction.
   * @param {Player} player
   */
  isPlayerMovingInExitDirection(player) {
    // Ensure that the player is not currently moving so that they can move onto the tile without immediately warping.
    if (
      player.stateMachine.currentState instanceof PlayerWalkingState &&
      player.stateMachine.currentState.isMoving
    )
      return false;

    // Determine whether the player is pressing the key which corresponds to the entry direction of the warp.
    switch (this.enterDirection) {
      case Direction.Up:
        return input.isKeyHeld(Input.KEYS.W);
      case Direction.Down:
        return input.isKeyHeld(Input.KEYS.S);
      case Direction.Left:
        return input.isKeyHeld(Input.KEYS.A);
      case Direction.Right:
        return input.isKeyHeld(Input.KEYS.D);
    }

    return false;
  }

  inTransitionAnimation(player) {
    // Set values to freeze user input during transition.
    player.isTransitioning = true;
    player.map.isTransitioning = true;

    switch (this.inTransition) {
      case "door":
        this.inTransitionDoor(player);
        break;
      case "none":
        this.inTransitionNone();
        break;
    }
  }

  outTransitionAnimation(player) {
    switch (this.outTransition) {
      case "door":
        this.outTransitionDoor(player);
        break;
      case "none":
        this.outTransitionNone(player);
        break;
    }
  }

  /**
   * @param {Player} player
   */
  inTransitionDoor(player) {
    // Open the door.
    sounds.play(SoundName.DoorOpen);
    player.map.openDoor(this.location.x, this.location.y - 1);
    // Set movement.
    timer.addTask(
      () => {},
      0.5,
      0.5,
      () => {
        player.stateMachine.change(PlayerStateName.Walking);
        player.direction = this.enterDirection;
        player.stateMachine.currentState.move();
        timer.addTask(
          () => {},
          0.5,
          0.5,
          () => {
            canvas.dispatchEvent(
              new CustomEvent("exitTransitionReady", { detail: this })
            );
          }
        );
      }
    );
  }

  inTransitionNone() {
    canvas.dispatchEvent(
      new CustomEvent("exitTransitionReady", { detail: this })
    );
  }

  /**
   *
   * @param {Player} player
   */
  outTransitionDoor(player) {
    player.map.openDoor(this.destinationTile.x, this.destinationTile.y);
    sounds.play(SoundName.DoorExit);

    player.stateMachine.change(PlayerStateName.Walking);
    player.stateMachine.currentState.move();
    timer.addTask(
      () => {
        player.map.closeDoor(this.destinationTile.x, this.destinationTile.y);
        sounds.play(SoundName.DoorOpen);
        player.isTransitioning = false;
        player.map.isTransitioning = false;
        player.stateMachine.change(PlayerStateName.Idling);
      },
      0.5,
      0.5
    );
  }

  /**
   *
   * @param {Player} player
   */
  outTransitionNone(player) {
    player.stateMachine.change(PlayerStateName.Idling);

    player.isTransitioning = false;
    player.map.isTransitioning = false;
  }
}
