import State from "../../../lib/State.js";
import { input, sounds, stateStack } from "../../globals.js";
import Panel from "../../user-interface/elements/Panel.js";
import Selector from "../../user-interface/elements/Selector.js";
import Input from "../../../lib/Input.js";
import SoundName from "../../enums/SoundName.js";

export default class PlayerInventoryViewState extends State {
  constructor(player) {
    super();
    this.player = player;

    const panel = Panel.BOTTOM_DIALOGUE;
    this.menuPanel = new Panel(panel.x, panel.y, panel.width, panel.height);

    const entries = [
      ...this.player.inventory.map((item) => ({
        text: `Item: ${item.name}`,
        onSelect: () => {}, // No action
      })),
      ...this.player.fragments.map((fragment, i) => ({
        text: `Fragment ${i + 1}: ${fragment.name || fragment}`,
        onSelect: () => {}, // No action
      })),
      { text: "Close", onSelect: () => stateStack.pop() },
    ];

    this.selector = new Selector(
      panel.x,
      panel.y,
      panel.width,
      panel.height,
      entries
    );
  }

  update() {
    this.selector.update();
  }

  render() {
    this.menuPanel.render();
    this.selector.render();
  }
}
