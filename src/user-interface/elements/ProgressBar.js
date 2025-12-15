import UserInterfaceElement from "../UserInterfaceElement.js";
import { context } from "../../globals.js";
import Colour from "../../enums/Colour.js";

/**
 * A progress bar UI element with tweening support.
 * Can be used for health bars, experience bars, or any generic value bar.
 * Supports:
 *  - Health bar color changes (green/yellow/red) automatically.
 *  - Smooth animations when values change.
 */
export default class ProgressBar extends UserInterfaceElement {
  /**
   * @param {number} x - X position of the progress bar.
   * @param {number} y - Y position of the progress bar.
   * @param {number} width - Width of the bar in pixels.
   * @param {number} height - Height of the bar in pixels.
   * @param {number} currentValue - Current value of the bar.
   * @param {number} maxValue - Maximum value of the bar.
   * @param {object} options - Optional settings
   */
  constructor(x, y, width, height, currentValue, maxValue, options = {}) {
    super(x, y, width, height);

    /** @type {number} Current target value for the bar */
    this.current = currentValue;

    /** @type {number} Maximum value for the bar */
    this.max = maxValue;

    /** @type {number} Displayed value for smooth tweening */
    this.displayedValue = currentValue;

    /** @type {boolean} Whether this is a health bar */
    this.isHealthBar = options.isHealthBar ?? false;

    /** @type {boolean} Whether this is an experience bar */
    this.isExpBar = options.isExpBar ?? false;

    /** @type {string} Default color for EXP bars */
    this.defaultExpColor = Colour.Grey;

    /** @type {string} Background color for empty part of the bar */
    this.backgroundColor = options.backgroundColor ?? Colour.Grey;

    /** @type {boolean} Whether to auto-color based on value percentage */
    this.autoColor = options.autoColor ?? false;

    /** @type {string} Color of the bar when autoColor is false */
    this.barColor = options.barColor ?? Colour.Green;

    /** @type {number} Speed of value animation in pixels/sec */
    this.tweenSpeed = options.tweenSpeed ?? 40;
  }

  /**
   * Directly sets the displayed value (used after tween completes).
   * @param {number} newDisplayValue
   */
  setDisplayValue(newDisplayValue) {
    this.displayedValue = newDisplayValue;
  }

  /**
   * Updates the target value for the bar (health/exp/current stat).
   * @param {number} newValue
   */
  setValue(newValue) {
    this.current = newValue;
  }

  /**
   * Returns the color for health bars based on the percentage.
   * @returns {string} Color for the current health value.
   */
  getHealthColor() {
    const ratio = this.displayedValue / this.max;

    if (ratio <= 0.25) return Colour.Red;
    if (ratio <= 0.5) return Colour.Yellow;
    return Colour.Green;
  }

  /**
   * Determines the bar color based on autoColor setting or percentage.
   * @returns {string} Color to fill the bar.
   */
  getBarColor() {
    if (!this.autoColor) return this.barColor;

    const percentage = this.displayedValue / this.max;

    if (percentage <= 0.25) return Colour.Crimson;
    if (percentage <= 0.5) return Colour.Gold;
    return Colour.Chartreuse;
  }

  /**
   * Renders the progress bar.
   * Fills background first, then fills the bar based on displayed value.
   */
  render() {
    context.save();

    if (this.max <= 0) {
      context.restore();
      return;
    }

    const effectiveValue = this.displayedValue < 1 ? 0 : this.displayedValue;
    const percent = Math.max(0, Math.min(1, effectiveValue / this.max));
    const fillWidth = this.dimensions.x * percent;

    // Draw background (empty bar)
    context.fillStyle = this.backgroundColor;
    context.fillRect(
      this.position.x,
      this.position.y,
      this.dimensions.x,
      this.dimensions.y
    );

    // Draw filled portion of the bar
    if (percent > 0) {
      context.fillStyle = this.getBarColor();
      context.fillRect(
        this.position.x,
        this.position.y,
        fillWidth,
        this.dimensions.y
      );
    }

    context.restore();
  }
}
