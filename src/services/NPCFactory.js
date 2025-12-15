import NPC from "../entities/NPC.js";

export default class NPCFactory {
  constructor(context) {
    this.context = context;
    this.NPCs = {};
  }

  load(npcDefinitions) {
    this.NPCs = npcDefinitions;
  }

  get(map) {
    return this.NPCs[map];
  }
}
