import Animation from '../../../lib/Animation.js';
import State from '../../../lib/State.js';
import Direction from '../../enums/Direction.js';
import NPC from '../../entities/NPC.js';
import NPCStateName from '../../enums/NPCStateName.js';
import { getRandomPositiveInteger, oneInXChance } from '../../../lib/Random.js';

export default class NPCIdlingState extends State {
	/**
	 * In this state, the npc is stationary until a randomized value tells them to move.
	 *
	 * @param {NPC} npc
	 */
	constructor(npc) {
		super();

		this.npc = npc;

		this.animation = this.initializeAnimation();
	}

	enter() {
		this.faceDirection(this.npc.direction);
	}

	update() {
		this.faceDirection(this.npc.direction);

		if (!this.npc.canMove) {
			return;
		}

		if (oneInXChance(500)) {
			this.npc.direction = getRandomPositiveInteger(0, 3)
			this.faceDirection(this.npc.direction);
		} if (oneInXChance(700)) {
			this.npc.changeState(NPCStateName.Walking);
		}
	}

	faceDirection(direction) {
		this.npc.currentAnimation = this.animation[direction];
	}

	initializeAnimation() {
		/**
		 * NPCs that don't move have 4 sprites, those that do have 12.
		 * For those with movement, the idle sprites are the second in each directional sequence.
		 */
		if (this.npc.canMove) {
			return {
				[Direction.Up]: new Animation([4], 1),
				[Direction.Down]: new Animation([1], 1),
				[Direction.Left]: new Animation([7], 1),
				[Direction.Right]: new Animation([10], 1),
			}
		} else {
			return {
				[Direction.Up]: new Animation([1], 1),
				[Direction.Down]: new Animation([0], 1),
				[Direction.Left]: new Animation([2], 1),
				[Direction.Right]: new Animation([3], 1),
			}
		}
	}
}
