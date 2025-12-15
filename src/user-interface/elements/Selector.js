import UserInterfaceElement from "../UserInterfaceElement.js";
import SoundName from "../../enums/SoundName.js";
import { context, input, sounds } from "../../globals.js";
import Vector from "../../../lib/Vector.js";
import Input from "../../../lib/Input.js";
import Colour from "../../enums/Colour.js";

/**
 * Simple 2x2 selection panel for choosing an item or action.
 * Supports keyboard navigation (WASD/Arrow keys) and selection.
 */
export default class Selector extends UserInterfaceElement {
  /**
   * @param {number} x - X position of the panel.
   * @param {number} y - Y position of the panel.
   * @param {number} width - Width of the panel.
   * @param {number} height - Height of the panel.
   * @param {Array} items - List of items with `text` and `onSelect` action.
   */
  constructor(x, y, width, height, items) {
    super(x, y, width, height);

    /** @type {Array} Grid of entries containing label, position, and action */
    this.entries = this.buildGrid(items);

    /** @type {number} Selected row index (0 or 1) */
    this.selRow = 0;

    /** @type {number} Selected column index (0 or 1) */
    this.selCol = 0;

    /** @type {string} Configured font for labels */
    this.fontConfig = this.configureFont();
  }

  /**
   * Checks for input and updates selection or triggers action.
   */
  update() {
    // Vertical movement
    if (this.isPressed(Input.KEYS.W, Input.KEYS.ARROW_UP)) {
      this.moveVertical(-1);
    } else if (this.isPressed(Input.KEYS.S, Input.KEYS.ARROW_DOWN)) {
      this.moveVertical(1);
    }
    // Horizontal movement
    else if (this.isPressed(Input.KEYS.A, Input.KEYS.ARROW_LEFT)) {
      this.moveHorizontal(-1);
    } else if (this.isPressed(Input.KEYS.D, Input.KEYS.ARROW_RIGHT)) {
      this.moveHorizontal(1);
    }
    // Confirm selection
    else if (this.isPressed(Input.KEYS.ENTER, Input.KEYS.SPACE)) {
      this.triggerSelection();
    }
  }

  /**
   * Returns true if any of the provided keys are currently pressed.
   * @param  {...any} keys
   * @returns {boolean}
   */
  isPressed(...keys) {
    return keys.some((k) => input.isKeyPressed(k));
  }

  /**
   * Renders all entries in the 2x2 grid.
   */
  render() {
    for (let i = 0; i < this.entries.length; i++) {
      const slot = this.entries[i];
      const row = (i / 2) | 0;
      const col = i % 2;
      const selected = row === this.selRow && col === this.selCol;

      this.drawEntry(slot, selected);
    }
  }

  /**
   * Draws a single entry, highlighting it if selected.
   * @param {Object} entry - Entry object with label and position.
   * @param {boolean} highlight - Whether to highlight with an arrow.
   */
  drawEntry(entry, highlight) {
    context.save();
    context.font = this.fontConfig;
    context.textAlign = "left";
    context.textBaseline = "middle";

    if (highlight) this.drawArrow(entry.position);

    context.fillStyle = Colour.Black;
    context.fillText(entry.label, entry.position.x, entry.position.y);
    context.restore();
  }

  /**
   * Draws a small arrow pointing to the selected entry.
   * @param {Vector} pos - Position to draw the arrow.
   */
  drawArrow(pos) {
    context.save();
    context.fillStyle = Colour.Black;
    context.translate(pos.x - 14, pos.y - 4);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(6, 5);
    context.lineTo(0, 10);
    context.closePath();
    context.fill();

    context.restore();
  }

  /**
   * Move selection vertically and play selection sound.
   * @param {number} dir - Direction (-1 up, 1 down)
   */
  moveVertical(dir) {
    sounds.play(SoundName.SelectionMove);
    this.selRow = (this.selRow + (dir > 0 ? 1 : -1) + 2) % 2;
  }

  /**
   * Move selection horizontally and play selection sound.
   * @param {number} dir - Direction (-1 left, 1 right)
   */
  moveHorizontal(dir) {
    sounds.play(SoundName.SelectionMove);
    this.selCol = (this.selCol + (dir > 0 ? 1 : -1) + 2) % 2;
  }

  /**
   * Trigger the action of the currently selected entry.
   * Plays appropriate sound.
   */
  triggerSelection() {
    const index = this.selRow * 2 + this.selCol;
    const chosen = this.entries[index];

    if (chosen && chosen.action) {
      sounds.play(SoundName.SelectionChoice);
      chosen.action();
    } else {
      sounds.play(SoundName.SelectionMove);
    }
  }

  /**
   * Builds a 2x2 grid of entries from source items.
   * Fills empty slots with a placeholder "-".
   * @param {Array} srcItems
   * @returns {Array} List of entry objects with label, position, action
   */
  buildGrid(srcItems) {
    const list = [];
    const w = this.dimensions.x / 2;
    const h = this.dimensions.y / 2;

    for (let i = 0; i < 4; i++) {
      const r = (i / 2) | 0;
      const c = i % 2;

      const px = this.position.x + c * w + 30;
      const py = this.position.y + r * h + h * 0.5;

      const available = srcItems[i];

      list.push({
        label: available ? available.text : "-",
        action: available ? available.onSelect : null,
        position: new Vector(px, py),
      });
    }
    return list;
  }

  /**
   * Configures a font size that fits nicely inside the panel.
   * @returns {string} Font string for canvas context
   */
  configureFont() {
    const size = Math.min(
      UserInterfaceElement.FONT_SIZE,
      this.dimensions.y * 0.25
    );
    return `${size}px ${UserInterfaceElement.FONT_FAMILY}`;
  }
}
