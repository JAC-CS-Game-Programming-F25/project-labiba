import Animation from '../../../lib/Animation.js';
import State from '../../../lib/State.js';
import Direction from '../../enums/Direction.js';
import { timer } from '../../globals.js';
import Tile from '../../services/Tile.js';
import Easing from '../../../lib/Easing.js';
import NPCStateName from '../../enums/NPCStateName.js';

export default class NPCWalkingState extends State {
	/**
	 * In this state, the npc can move around the map one tile at a time.
	 * Their movement will end if they try to move into a collideable object
	 * or once they have finished moving one tile. 
	 *
	 * @param {NPC} npc
	 */
	constructor(npc) {
		super();

		this.npc = npc;
		this.collisionLayer = this.npc.map.collisionLayer;
		// Define animations. I am going with the generous assumption that all walking NPCs have three frames per cycle.
		this.animation = {
			[Direction.Up]: new Animation([3, 4, 5], 0.2),
			[Direction.Down]: new Animation([0, 1, 2], 0.2),
			[Direction.Left]: new Animation([6, 7, 8], 0.2),
			[Direction.Right]: new Animation([9, 10, 11], 0.2),
		};

		this.isMoving = false;
	}

	enter() {
		// When the NPC moves, they only move one tile at a time, and then go back to idling.
		this.move();
	}

	update(dt) {
		this.npc.currentAnimation = this.animation[this.npc.direction];
	}

	move() {
		let x = this.npc.position.x;
		let y = this.npc.position.y;

		switch (this.npc.direction) {
			case Direction.Up:
				y--;
				break;
			case Direction.Down:
				y++;
				break;
			case Direction.Left:
				x--;
				break;
			case Direction.Right:
				x++;
				break;
		}

		if (!this.isValidMove(x, y)) {
			this.npc.changeState(NPCStateName.Idling);
			return;
		}

		this.npc.position.x = x;
		this.npc.position.y = y;

		this.npc.currentAnimation = this.animation[this.npc.direction];

		this.tweenMovement(x, y);
	}

	tweenMovement(x, y) {
		timer.tween(
			this.npc.canvasPosition,
			{ x: x * Tile.SIZE, y: y * Tile.SIZE },
			1,
			Easing.linear,
			() => {
				this.npc.changeState(NPCStateName.Idling);
			}
		);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns Whether the npc is going to move on to a non-collidable tile.
	 */
	isValidMove(x, y) {
		return this.collisionLayer.getTile(x, y) === null &&
			!(this.npc.map.player.position.x === x && this.npc.map.player.position.y === y);
	}
}
