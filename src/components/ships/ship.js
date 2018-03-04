import {rotateRight} from '../../utils/matrix';

export const DOT_SHAPE = 'DOT_SHAPE';
export const L_SHAPE = 'L_SHAPE';
export const REVERSE_L_SHAPE = 'REVERSE_L_SHAPE';
export const I_SHAPE = 'I_SHAPE';

const shipTypes = {
	[DOT_SHAPE]: {
		shape: [
			[[1]]
		]
	},
	[L_SHAPE]: {
		shape: [
			[1, 0],
			[1, 0],
			[1, 1]
		]
	},
	[REVERSE_L_SHAPE]: {
		shape: [
			[0, 1],
			[0, 1],
			[1, 1]
		]
	},
	[I_SHAPE]: {
		shape: [[1, 1, 1, 1]]
	}
};

export default class Ship {
	constructor(type) {
		this.field = shipTypes[type];
	}

	rotateRight () {
		this.field = rotateRight(this.field);
		return this.field;
	}
}