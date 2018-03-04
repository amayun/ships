import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';
import {flatMap} from '../../utils/matrix';
import {curry} from '../../utils/function';
import './style.css';

const b = block('field');

const cellTypes = {
	0: 'empty',
	1: 'destroyed',
	2: 'damaged',
	3: 'ship',
	4: 'miss'
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
			onClick={curry(this.props.onShot, dot, x, y)}
		/>
	}
}