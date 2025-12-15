import State from "../../../lib/State.js";
import {
  context,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  input,
  stateStack,
} from "../../globals.js";
import Input from "../../../lib/Input.js";

export default class InstructionsState extends State {
  constructor() {
    super();

    // You can add scrolling or pagination later if needed
    this.lines = [
      "CONTROLS:",
      "- Interact / Talk: E",
      "- Open Inventory: I",
      "- Pause Menu: Esc",
      "- Confirm: Enter",
      "- Cancel: Backspace",
      "",
      "GOAL:",
      "Collect all 3 fragments before time runs out!",
      "Fragments are locked until certain NPCs are interacted with.",
      "",
      "Press Enter to return to the Title Screen",
    ];

    this.font = "15px Tiny5";
    this.lineHeight = 25;
  }

  enter() {
    // No special actions needed on enter
  }

  update() {
    // Go back to the title screen when Enter is pressed
    if (input.isKeyPressed(Input.KEYS.ENTER)) {
      stateStack.pop();
    }
  }

  render() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.fillStyle = "white";
    context.font = this.font;
    context.textAlign = "left";

    const startX = 50;
    let startY = 50;

    this.lines.forEach((line) => {
      context.fillText(line, startX, startY);
      startY += this.lineHeight;
    });
  }
}
