import Doubt from "../entities/Enemies/Doubt.js";
import Anxiety from "../entities/Enemies/Anxiety.js";
import Gloom from "../entities/Enemies/Gloom.js";
import EnemyType from "../enums/EnemyType.js";

export default class EnemyFactory {
  /**
   * Creates a new Enemy instance based on type
   * @param {string} type - EnemyType string
   * @param {Map} map - reference to the map
   * @returns {Enemy}
   */
  static createInstance(type, map) {
    let enemy = null;

    switch (type.toLowerCase()) {
      case EnemyType.Doubt:
        enemy = new Doubt();
        break;

      case EnemyType.Anxiety:
        enemy = new Anxiety();
        break;

      case EnemyType.Gloom:
        enemy = new Gloom();
        break;
    }

    if (enemy) {
      // assign map reference so enemy can access it if needed
      enemy.map = map;

      // set canvasPosition from tile position
      enemy.canvasPosition = {
        x: (enemy.position?.x ?? 0) * 32, // fallback in case position not yet set
        y: (enemy.position?.y ?? 0) * 32,
      };
    }

    return enemy;
  }
}
