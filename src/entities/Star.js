import GameEntity from "./GameEntity.js";
import Sprite from "../../lib/Sprite.js";
import Animation from "../../lib/Animation.js";
import Tile from "../services/Tile.js";
import { images } from "../globals.js";

export default class Star extends GameEntity {
  /**
   * @param {Vector} position Tile position where the star should appear
   */
  constructor(position, fragmentId) {
    super({ position });

    // Load star sprites
    this.sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get("star"),
      32, // frame width
      32 // frame height
    );

    // Animation (looping through 4 frames)
    this.animation = new Animation([0, 1, 2, 3], 0.2);
    this.currentFrame = this.animation.getCurrentFrame();
    this.fragmentId = fragmentId;
  }

  update(dt) {
    this.animation.update(dt);
    this.currentFrame = this.animation.getCurrentFrame();
  }

  render() {
    const x = Math.floor(this.canvasPosition.x);
    const y = Math.floor(this.canvasPosition.y - Tile.SIZE / 2);
    this.sprites[this.currentFrame].render(x, y);
  }
}
