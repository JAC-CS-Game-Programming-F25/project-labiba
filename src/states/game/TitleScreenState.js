import State from "../../../lib/State.js";
import Colour from "../../enums/Colour.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import PlayState from "./PlayState.js";
import TransitionState from "./TransitionState.js";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  context,
  images,
  input,
  sounds,
  stateStack,
  timer,
} from "../../globals.js";
import Input from "../../../lib/Input.js";
import Easing from "../../../lib/Easing.js";
import InstructionsState from "./InstructionsState.js";
import SaveManager from "../../game/SaveManager.js";

export default class TitleScreenState extends State {
  static POSITION = {
    start: { x: 480, y: 150 },
    mid: { x: 160, y: 150 },
    end: { x: -160, y: 150 },
  };

  /**
   * Consists of some text fields and a carousel of
   * sprites that are displayed on the screen. There
   * is then a fading transition to the next screen.
   *
   * @param {object} mapDefinition
   */
  constructor(mapDefinitions, exitDefinition, trialDefinition) {
    super();

    this.options = ["Start", "Load", "Instructions"];
    this.selectedIndex = 0;
    this.optionWidth = 300;
    this.optionHeight = 60;
    this.optionSpacing = 20;
    this.titleY = 25;
    this.mapDefinitions = mapDefinitions;
    this.exitDefinition = exitDefinition;
    this.trialDefinition = trialDefinition;
  }

  enter() {
    sounds.play(SoundName.Title);
    this.render();
  }

  exit() {
    sounds.stop(SoundName.Title);
    this.timer?.clear();
  }

  update() {
    // Navigate options
    if (input.isKeyPressed(Input.KEYS.W) || input.isKeyPressed(Input.KEYS.UP)) {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.options.length) % this.options.length;
    } else if (
      input.isKeyPressed(Input.KEYS.S) ||
      input.isKeyPressed(Input.KEYS.DOWN)
    ) {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
    }

    // Select option
    if (input.isKeyPressed(Input.KEYS.ENTER)) {
      const selectedOption = this.options[this.selectedIndex];

      switch (selectedOption) {
        case "Start":
          console.log("Start game");
          this.play();
          break;
        case "Load":
          console.log("Load game");
          this.loadGame();
          break;
        case "Instructions":
          stateStack.push(new InstructionsState());
          break;
      }
    }
  }

  render() {
    context.save();
    // Draw background map
    images.render(ImageName.Playground, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw title
    context.font = "50px Tiny5";
    context.fillStyle = "white";
    context.textBaseline = "top";
    context.textAlign = "center";
    context.fillText("Fragments of Lumina", CANVAS_WIDTH / 2, this.titleY);

    // Draw option rectangles
    const startY = this.titleY + 100; // starting position for options
    this.options.forEach((option, i) => {
      const x = CANVAS_WIDTH / 2 - this.optionWidth / 2;
      const y = startY + i * (this.optionHeight + this.optionSpacing);

      // Draw rectangle
      context.fillStyle =
        i === this.selectedIndex ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.5)";
      context.fillRect(x, y, this.optionWidth, this.optionHeight);

      // Draw text
      context.fillStyle = "white";
      context.font = "28px Tiny5";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(option, CANVAS_WIDTH / 2, y + this.optionHeight / 2);
    });

    context.restore();
  }

  play() {
    TransitionState.fade(() => {
      stateStack.pop();
      stateStack.push(
        new PlayState(
          this.mapDefinitions,
          this.exitDefinition,
          this.trialDefinition,
          false
        )
      );
    });
  }
  loadGame() {
    const save = SaveManager.load();

    if (!save) {
      console.warn("No save found");
      return;
    }

    TransitionState.fade(() => {
      stateStack.pop();
      stateStack.push(
        new PlayState(
          this.mapDefinitions,
          this.exitDefinition,
          this.trialDefinition,
          true
        )
      );
    });
  }
}
