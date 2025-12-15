import Colour from "../enums/Colour.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  DEBUG,
  stateStack,
  images,
} from "../globals.js";
import Exit from "../services/Exit.js";
import NPC from "../entities/NPC.js";
import { sisterDialogue, elderRowanDialogue } from "../game/npcDialogue.js";
import EnemyFactory from "./EnemyFactory.js";
import EnemyType from "../enums/EnemyType.js";
import { StoryFlags } from "../game/StoryFlags.js";
import TrialTile from "./TrialTile.js";
import Star from "../entities/Star.js";
import VictoryState from "../states/game/VictoryState.js";
import TransitionState from "../states/game/TransitionState.js";

const dialogueMap = {
  sisterDialogue,
  elderRowanDialogue,
};
export default class Map {
  /**
   * The collection of layers, sprites,
   * and characters that comprises the world.
   *
   * @param {object} mapDefinition JSON from Tiled map editor.
   */
  constructor(
    mapDefinition,
    exitDefinition = [],
    NPCDefinitions = [],
    trialDefinition = {}
  ) {
    this.name = mapDefinition.name;
    const sprites = Sprite.generateSpritesFromSpriteSheet(
      images.get(ImageName.Tiles),
      Tile.SIZE,
      Tile.SIZE
    );

    this.bottomLayer = new Layer(mapDefinition.layers[Layer.BOTTOM], sprites);
    this.collisionLayer = new Layer(
      mapDefinition.layers[Layer.COLLISION],
      sprites
    );
    this.topLayer = new Layer(mapDefinition.layers[Layer.TOP], sprites);
    this.player = new Player({ position: new Vector(7, 5) }, this);

    this.isTransitioning = false;
    this.exits = exitDefinition.map((definition) => new Exit(definition));
    this.NPCs = NPCDefinitions.map((definition) => {
      console.log("NPC definition dialogue key:", definition.dialogue);

      const npc = new NPC(definition, this);

      if (definition.dialogue) {
        npc.dialogues = dialogueMap[definition.dialogue];
        console.log("Mapped to:", npc.dialogues);
      }

      return npc;
    });

    this.enemies = [];

    const mapName = mapDefinition.name;
    const trialsForMap = trialDefinition[this.name] || [];
    this.trials = trialsForMap
      .filter((def) => {
        if (def.fragmentId === 1 && StoryFlags.fragment1Obtained) return false;
        if (def.fragmentId === 2 && StoryFlags.fragment2Obtained) return false;
        if (def.fragmentId === 3 && StoryFlags.fragment3Obtained) return false;
        return true;
      })
      .map((def) => new TrialTile(def));

    this.trialStars = this.trials.map(
      (trial) => new Star(trial.position, trial.fragmentId)
    );

    // const enemyDefinitions = enemyDefinitionsByMap[mapName] ?? [];

    // enemyDefinitions.forEach((definition) => {
    //   if (this.shouldSpawnEnemy(definition.type)) {
    //     const enemy = EnemyFactory.createInstance(definition.type, this);

    //     if (!enemy) return; // safety check

    //     // sync tile position
    //     enemy.position = {
    //       x: definition.position.x,
    //       y: definition.position.y,
    //     };
    //     enemy.canvasPosition = {
    //       x: enemy.position.x * Tile.SIZE,
    //       y: enemy.position.y * Tile.SIZE,
    //     };

    //     this.enemies.push(enemy);
    //   }
    // });

    // console.log("Enemies in map:", mapName, this.enemies);
    // console.log("Enemy defs:", enemyDefinitions);
  }

  update(dt) {
    this.player.update(dt);
    this.NPCs.forEach((npc) => {
      npc.update(dt);
    });
    this.trials.forEach((trial) => {
      trial.tryActivate(this.player, (fragmentId) => {
        this.player.collectFragment(fragmentId);

        this.trialStars = this.trialStars.filter(
          (star) => star.fragmentId !== fragmentId
        );
        if (this.player.fragmentsCollected == 3) {
          console.log("All fragments collected! Triggering VictoryState.");
          TransitionState.fade(() => {
            stateStack.push(new VictoryState());
          });
        }
      });
    });

    // Update remaining stars
    this.trialStars.forEach((star) => star.update(dt));
  }

  checkExit() {
    for (const exit of this.exits) {
      if (
        exit.isEntityOnExitTile(this.player) &&
        exit.isPlayerMovingInExitDirection(this.player)
      ) {
        return exit;
      }
    }
    return null;
  }
  render() {
    this.bottomLayer.render();
    this.collisionLayer.render();
    this.buildRenderQueue().forEach((entity) => {
      entity.render();
    });
    this.trialStars.forEach((star) => star.render());
    this.topLayer.render();

    if (DEBUG) {
      Map.renderGrid();
    }
  }

  /**
   * Draws a grid of squares on the screen to help with debugging.
   */
  static renderGrid() {
    context.save();
    context.strokeStyle = Colour.White;

    for (let y = 1; y < CANVAS_HEIGHT / Tile.SIZE; y++) {
      context.beginPath();
      context.moveTo(0, y * Tile.SIZE);
      context.lineTo(CANVAS_WIDTH, y * Tile.SIZE);
      context.closePath();
      context.stroke();

      for (let x = 1; x < CANVAS_WIDTH / Tile.SIZE; x++) {
        context.beginPath();
        context.moveTo(x * Tile.SIZE, 0);
        context.lineTo(x * Tile.SIZE, CANVAS_HEIGHT);
        context.closePath();
        context.stroke();
      }
    }

    context.restore();
  }

  buildRenderQueue() {
    return [...this.NPCs, this.player].sort((a, b) => {
      if (a.position.y < b.position.y) {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
