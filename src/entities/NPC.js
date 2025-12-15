import { getRandomPositiveInteger } from "../../lib/Random.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import ImageName from "../enums/ImageName.js";
import NPCStateName from "../enums/NPCStateName.js";
import { images } from "../globals.js";
import NPCIdlingState from "../states/npc/NPCIdlingState.js";
import NPCWalkingState from "../states/npc/NPCWalkingState.js";
import GameEntity from "./GameEntity.js";

export default class NPC extends GameEntity {
  /**
   *
   * @param {object} definition
   */
  constructor(definition, map) {
    super(definition);

    this.map = map;
    this.canMove = definition.canMove;
    this.dialogues = definition.dialogue;
    this.dialogueIndex = 0;

    // Get the sprites for this npc.
    const spriteSheet = images.get(ImageName.NPCs);
    this.sprites = [];
    for (let i = 0; i < definition.totalSprites; i++) {
      this.sprites.push(
        new Sprite(
          spriteSheet,
          definition.firstSprite.x + i * GameEntity.WIDTH + i * 2,
          definition.firstSprite.y,
          GameEntity.WIDTH,
          GameEntity.HEIGHT
        )
      );
    }

    // Set up the state machine.
    this.stateMachine = new StateMachine();
    this.stateMachine.add(NPCStateName.Idling, new NPCIdlingState(this));
    if (this.canMove) {
      this.stateMachine.add(NPCStateName.Walking, new NPCWalkingState(this));
    }
    this.stateMachine.change(NPCStateName.Idling);

    // Set current Animation.
    this.currentAnimation =
      this.stateMachine.currentState.animation[this.direction];
    this.currentFrame = 0;

    this.update(0);
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
     */
    const y = Math.floor(this.canvasPosition.y - GameEntity.HEIGHT / 2);

    super.render(x, y);
  }

  getDialogue() {
    const lines = this.dialogues(); // array of strings

    const signature = lines.join("|");

    // If dialogue changed → reset index
    if (this.lastDialogueSignature !== signature) {
      this.dialogueIndex = 0;
      this.lastDialogueSignature = signature;
    }

    // Pick current line
    const line = lines[Math.min(this.dialogueIndex, lines.length - 1)];

    // Move to next line for next interaction
    if (this.dialogueIndex < lines.length - 1) {
      this.dialogueIndex++;
    }

    return line;
  }
}
