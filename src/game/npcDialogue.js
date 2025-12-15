import { StoryFlags } from "./StoryFlags.js";

export const sisterDialogue = () => {
  if (!StoryFlags.fragment1Obtained) {
    return [
      "I feel like something is missing in you...",
      "Maybe you should explore the forest.",
    ];
  } else if (!StoryFlags.fragment2Obtained) {
    if (!StoryFlags.pureLightSeedsCollected) {
      return [
        "Be careful out there.",
        "The town might be where you found the rest of you",
      ];
    } else {
      return ["You’ve done well!", "Keep going, the next fragment awaits."];
    }
  } else if (StoryFlags.fragment2Obtained && !StoryFlags.sisterTaken) {
    return ["Thank you for returning the fragments safely!"];
  } else {
    return ["I have been taken... Hurry!"];
  }
};

export const elderRowanDialogue = () => {
  if (!StoryFlags.fragment2Obtained) {
    return ["Ah, adventurer!", "You should seek the shiny thing over there."];
  } else {
    return [
      "You’ve proven yourself. Im sure that what lies on top of those stairs is nothing for you!",
      "The path to ruin might open another day.",
    ];
  }
};
