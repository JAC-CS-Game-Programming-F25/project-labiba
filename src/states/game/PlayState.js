import State from "../../../lib/State.js";
import SoundName from "../../enums/SoundName.js";
import Input from "../../../lib/Input.js";
import {
  canvas,
  input,
  sounds,
  stateStack,
  npcFactory,
  timer,
} from "../../globals.js";
import Panel from "../../user-interface/elements/Panel.js";
import Map from "../../services/Map.js";
import DialogueState from "./DialogueState.js";
import MapName from "../../enums/MapName.js";
import TransitionState from "./TransitionState.js";
import Tile from "../../services/Tile.js";
import GameOverState from "./GameOverState.js";
import SaveManager from "../../game/SaveManager.js";
import { StoryFlags } from "../../game/StoryFlags.js";
import PlayerInventoryViewState from "./PlayerInventoryViewState.js";

export default class PlayState extends State {
  /**
   * Contains the main world map the player
   * can travel within.
   *
   * @param {object} mapDefinition
   */
  constructor(
    mapDefinitions,
    exitDefinition,
    trialDefinition,
    loadSave = false
  ) {
    super();

    this.maps = {};
    this.loadSave = loadSave;
    this.firstFragmentCollected = false;
    let save = null;

    if (this.loadSave) {
      save = SaveManager.load();

      if (save) {
        Object.assign(StoryFlags, save.storyFlags);
      } else {
        Object.keys(StoryFlags).forEach((key) => {
          StoryFlags[key] = false;
        });
        SaveManager.clear();
      }
    }

    // CREATE ALL MAPS
    mapDefinitions.forEach((definition) => {
      const mapName = definition.name;
      const NPCDefinitions = npcFactory.get(mapName);

      const map = new Map(
        definition,
        exitDefinition[mapName],
        NPCDefinitions,
        trialDefinition
      );

      map.onFirstFragmentCollected = () => {
        this.firstFragmentCollected = true;
        this.firstFragmentTimer?.clear();
        this.firstFragmentTimer = null;
      };

      this.maps[mapName] = map;
    });

    // SET CURRENT MAP
    const startMapName = save?.map ?? MapName.Playground;
    this.currentMap = this.maps[startMapName];

    //APPLY PLAYER SAVE DATA
    if (save && this.currentMap) {
      const player = this.currentMap.player;

      player.position.x = save.player.x;
      player.position.y = save.player.y;
      player.inventory = save.player.inventory;
      player.fragments = save.player.fragments;

      player.canvasPosition.x = player.position.x * Tile.SIZE;
      player.canvasPosition.y = player.position.y * Tile.SIZE;
    }

    // TIMER
    this.firstFragmentTimer = timer.addTask(
      () => {},
      0,
      100,
      () => {
        if (!this.firstFragmentCollected) {
          TransitionState.fade(
            () => {
              stateStack.push(
                new GameOverState("Time's up! Better luck next time!!")
              );
            },
            { r: 0, g: 0, b: 0 }
          );
        }
      }
    );

    //  EXIT HANDLING ()
    canvas.addEventListener("exitTransitionReady", (event) => {
      const exit = event.detail;

      TransitionState.fade(
        () => {
          this.changeMap(exit.destinationMap);

          const player = this.currentMap.player;
          player.position.x = exit.destinationTile.x;
          player.position.y = exit.destinationTile.y;
          player.canvasPosition.x = exit.destinationTile.x * Tile.SIZE;
          player.canvasPosition.y = exit.destinationTile.y * Tile.SIZE;
          player.direction = exit.destinationDirection;

          player.update(0);
        },
        () => {
          exit.outTransitionAnimation(this.currentMap.player);
        }
      );
    });
  }

  enter() {
    sounds.play(SoundName.Route);

    stateStack.push(
      new DialogueState(
        `Welcome Ari! \n\n\
			In this world you must found the three fragment of your soul \n\
			before the timer is up. \
			Finding those fragment in time will guarantee your safety and return
      to your world \n\n\
			If you dont find them in time then you will die!\n\n\
      Walk around and talk to other to help you find your way. \n
			Good luck!`,
        Panel.TOP_DIALOGUE
      )
    );
  }

  update(dt) {
    if (!this.currentMap.isTransitioning) {
      const exit = this.currentMap.checkExit();
      if (exit) {
        exit.inTransitionAnimation(this.currentMap.player);
      }
    }
    this.currentMap.update(dt);
    if (input.isKeyPressed(Input.KEYS.i) || input.isKeyPressed(Input.KEYS.I)) {
      stateStack.push(new PlayerInventoryViewState(this.currentMap.player));
    }
  }

  render() {
    this.currentMap.render();
  }

  changeMap(mapName) {
    // No switch if the map doesn't exist
    if (!this.maps[mapName]) return;

    // Set the current map
    this.currentMap = this.maps[mapName];
    this.currentMap.isTransitioning = false;
    this.currentMap.player.isTransitioning = false;
    sounds.play(SoundName.Save);
    SaveManager.save(this.currentMap.player, this.currentMap.name);
  }
}
