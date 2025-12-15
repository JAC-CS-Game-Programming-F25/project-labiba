import Input from "../../lib/Input.js";
import Vector from "../../lib/Vector.js";
import { input, sounds, stateStack } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import DialogueState from "../states/game/DialogueState.js";
import Panel from "../user-interface/elements/Panel.js";
import { StoryFlags } from "../game/StoryFlags.js";
import SaveManager from "../game/SaveManager.js";

export default class TrialTile {
  constructor(definition) {
    this.position = new Vector(definition.x, definition.y);
    this.fragmentId = definition.fragmentId;
    this.completed = false;
  }

  isPlayerNearby(player) {
    const dx = Math.abs(player.position.x - this.position.x);
    const dy = Math.abs(player.position.y - this.position.y);

    return (dx === 0 && dy === 0) || dx + dy === 1;
  }

  tryActivate(player, onComplete) {
    if (this.completed) return;

    if (this.isPlayerNearby(player) && input.isKeyPressed(Input.KEYS.E)) {
      this.completed = true;

      // Story dialogue based on fragment
      switch (this.fragmentId) {
        case 1:
          StoryFlags.fragment1Obtained = true;
          sounds.play(SoundName.MenuOpen);
          stateStack.push(
            new DialogueState(
              "You have found the Lost Beast's Fragment!\nLumie glows warmly in response...",
              Panel.BOTTOM_DIALOGUE
            )
          );
          break;
        case 2:
          StoryFlags.fragment2Obtained = true;
          stateStack.push(
            new DialogueState(
              "The Door of Echoes Fragment radiates power.\nScout Mira's voice echoes in your mind.",
              Panel.BOTTOM_DIALOGUE
            )
          );
          break;
        case 3:
          StoryFlags.fragment3Obtained = true;
          stateStack.push(
            new DialogueState(
              "Heart of Lumina Fragment collected.\nA surge of memories floods back into you...",
              Panel.BOTTOM_DIALOGUE
            )
          );
          break;
      }

      onComplete(this.fragmentId);
    }
  }
}
