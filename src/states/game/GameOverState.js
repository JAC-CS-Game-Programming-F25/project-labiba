import State from "../../../lib/State.js";
import { context, CANVAS_HEIGHT, CANVAS_WIDTH, input } from "../../globals.js";
import Input from "../../../lib/Input.js";

export default class GameOverState extends State {
  constructor(message = "Game Over!") {
    super();
    this.message = message;
  }

  update(dt) {}

  render() {
    context.fillStyle = "black";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.fillStyle = "red";
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText(this.message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }
}
