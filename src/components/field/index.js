import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';
import {flatMap} from '../../utils/matrix';
import {curry} from '../../utils/function';
import './style.css';

const b = block('field');

export const DOT_EMPTY = 0;
export const DOT_DESTROYED = 1;
export const DOT_DAMAGED = 2;
export const DOT_SHIP = 3;
export const DOT_MISS = 4;

const cellTypes = {
	[DOT_EMPTY]: 'empty',
	[DOT_DESTROYED]: 'destroyed',
	[DOT_DAMAGED]: 'damaged',
	[DOT_SHIP]: 'ship',
	[DOT_MISS]: 'miss'
};

const cellTurns = {
	[DOT_EMPTY]: DOT_MISS,
	[DOT_DESTROYED]: DOT_DESTROYED,
	[DOT_DAMAGED]: DOT_DAMAGED,
	[DOT_SHIP]: DOT_DAMAGED,
	[DOT_MISS]: DOT_MISS
};

export default class Field extends Component {
	static propTypes = {
		field: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
		onShot: PropTypes.func
	};

	render() {
		const {field} = this.props;
		return (
			<div className={b()}>
				{flatMap(field, this._renderCell)}
			</div>
		)
	}

	_renderCell = (dot, x, y) => {
		return <div
			key={`${x}_${y}`}
			className={b('cell', {[cellTypes[dot]]: true})()}
			onClick={curry(this.props.onShot, dot, cellTurns[dot], x, y)}
		/>
	}
}