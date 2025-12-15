import SoundName from "../../enums/SoundName.js";
import State from "../../../lib/State.js";
import { canvas, stateStack, sounds } from "../../globals.js";

export default class VictoryState extends State {
  constructor(message = "Congratulations! You collected all fragments!") {
    super();
    this.message = message;
    this.timeElapsed = 0;
    this.displayDuration = 5; // seconds before automatically leaving the state
  }

  enter() {
    sounds.play(SoundName.Victory);
    console.log("Victory! Player collected all fragments.");
  }

  update(dt) {
    this.timeElapsed += dt;
    if (this.timeElapsed >= this.displayDuration) {
      stateStack.pop(); // exit VictoryState
    }
  }

  render() {
    const ctx = canvas.getContext("2d");

    // Semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.message, canvas.width / 2, canvas.height / 2);
  }
}
