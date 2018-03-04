import {rotateRight} from '../../utils/matrix';
import {times, rand} from '../../utils/function';

export const DOT_SHAPE = 'DOT_SHAPE';
export const L_SHAPE = 'L_SHAPE';
export const REVERSE_L_SHAPE = 'REVERSE_L_SHAPE';
export const I_SHAPE = 'I_SHAPE';

const shipTypes = {
	[DOT_SHAPE]: {
		shape: [[3]]
	},
	[L_SHAPE]: {
		shape: [
			[3, 0],
			[3, 0],
			[3, 3]
		]
	},
	[REVERSE_L_SHAPE]: {
		shape: [
			[0, 3],
			[0, 3],
			[3, 3]
		]
	},
	[I_SHAPE]: {
		shape: [[3, 3, 3, 3]]
	}
};

export default class Ship {
	constructor(type) {
		this.field = shipTypes[type].shape;
		this.x = 0;
		this.y = 0;
		this.destroyed = false;
	}

	rotateRight = () => {
		this.field = rotateRight(this.field);
		return this.field;
	};

	rotateRandomly = () => {
		const rotateTimes = rand(0, 3);
		times(this.rotateRight, rotateTimes);
	};

	setCoords(x, y) {
		this.x = x;
		this.y = y;
	}
}