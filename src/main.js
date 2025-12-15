/**
 * Fragments of Lumina
 *

 *
 * Fragments of Lumina is a narrative-driven 2D adventure game where the player awakens in a blank void with only a floating light named Lumie as their guide. The player soon discovers that they have lost their memories - including the memory of their sister, who becomes the first main NPC and the player's save point. The world has been shattered into three Soul Fragments, each protected by corrupted guardians. To restore the world — and the player’s identity — players must explore the map, uncover secrets, fight monsters and bosses, and make choices that can save or doom key characters.
 * This work is still a work in progress and will be update with more as time goes on.
 *
 * All Assets
 * @see https://reliccastlearchive.neocities.org/
 * @see https://fonts.google.com/specimen/Tiny5?categoryFilters=Appearance:%2FTheme%2FPixel
 * @see https://freesound.org/people/Fenodyrie/sounds/583947/
 */

import Game from "../lib/Game.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import {
  canvas,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  fonts,
  images,
  npcFactory,
  sounds,
  stateStack,
  timer,
} from "./globals.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute("tabindex", "1"); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

const {
  images: imageDefinitions,
  fonts: fontDefinitions,
  sounds: soundDefinitions,
} = await fetch("./config/assets.json").then((response) => response.json());
const mapDefinitions = [];
mapDefinitions.push(
  await fetch("./config/playground.json").then((response) => response.json())
);
mapDefinitions.push(
  await fetch("./config/path.json").then((response) => response.json())
);
mapDefinitions.push(
  await fetch("./config/bossOneZone.json").then((response) => response.json())
);
mapDefinitions.push(
  await fetch("./config/town.json").then((response) => response.json())
);
mapDefinitions.push(
  await fetch("./config/stair.json").then((response) => response.json())
);
const exitDefinition = await fetch("./config/exit.json").then((response) =>
  response.json()
);
const npcDefinitions = await fetch("./config/npcs.json").then((response) =>
  response.json()
);
const trialDefinition = await fetch("./config/trial.json").then((response) =>
  response.json()
);
const enemyDefinitions = await fetch("./config/enemies.json").then((response) =>
  response.json()
);

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);
npcFactory.load(npcDefinitions);

// Add all the states to the state machine.
stateStack.push(
  new TitleScreenState(mapDefinitions, exitDefinition, trialDefinition)
);
// stateStack.push(new InstructionsState());
const game = new Game(stateStack, context, timer, CANVAS_WIDTH, CANVAS_HEIGHT);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
