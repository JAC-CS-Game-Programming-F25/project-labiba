import { StoryFlags } from "./StoryFlags.js";

const SAVE_KEY = "lumina_save";

export default class SaveManager {
  static save(player, mapName) {
    const saveData = {
      map: mapName,
      storyFlags: { ...StoryFlags },
      player: {
        x: player.position.x,
        y: player.position.y,
        inventory: [...player.inventory],
        fragments: [...player.fragments],
      },
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved:", saveData);
  }

  static load() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Save corrupted");
      return null;
    }
  }

  static clear() {
    localStorage.removeItem(SAVE_KEY);
  }
}
