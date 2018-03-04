import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';
import Ship from '../ship';
import {times, rand} from '../../utils/function';
import matrix from '../../utils/matrix';
import Field from '../field';

const b = block('ships');

export default class Ships extends Component {
	static propTypes = {
		fieldSize: PropTypes.number,
		availableShips: PropTypes.array
	};

	static defaultProps = {
		fieldSize: 10
	};

	constructor(props) {
		super(props);

		this.state = {
			field: this._generateEmptyField(),
			ships: [],
			started: false
		};
	}

	componentDidMount() {
		this._placeShipsRandomly();
	}

	render() {
		const {field} = this.state;
		return (
			<div className={b()}>
				<pre>{this._getFieldString(field)}</pre>
				<Field field={field} onShot={this._handleCellClick}/>
			</div>
		);
	}

	_generateEmptyField() {
		const {fieldSize} = this.props;
		return times(() => Array(fieldSize).fill(0), fieldSize)
	}

	_placeShipsRandomly() {
		const {availableShips} = this.props;
		const {field} = this.state;
		const ships = [];
		let newField = matrix.clone(field);

		availableShips.forEach(shipType => {
			const ship = new Ship(shipType);
			ship.rotateRandomly();

			newField = this._placeShipRandomly(newField, ship);
			ships.push(ship);
		});

		this.setState({ships, field: newField});
	}

	_placeShipRandomly(field, ship) {
		const {fieldSize} = this.props;
		const retries = 30;

		for(let i = 0; i< retries; i ++){
			const x = rand(0, fieldSize - 1);
			const y = rand(0, fieldSize - 1);
			if(this._checkPossibleShipPosition(field, ship, x, y)) {
				return matrix.plus(field, ship.field, x, y);
			}
		}

		throw new Error('Can\'t place a ship randomly');
	}

	_checkPossibleShipPosition(field, ship, x, y) {
		let result = true;

		matrix.forEach(ship.field, (dot, shipX, shipY) => {
			if (dot && !this._checkAround(field, x + shipX, y + shipY)) {
				result = false
			}
		});

		return result
	}

	_handleCellClick = (dot, x, y) => {
		console.log('dot, x, y', dot, x, y);
	};

	_checkAround(field, x, y) {
		for (let row = -1; row < 2; row++) {
			for (let col = -1; col < 2; col++) {
				if (field[y + row] !== undefined && field[y + row][x + col]) {
					return false;
				}
			}
		}

		return field[y] !== undefined && field[y][x] !== undefined;
	}

	_getFieldString(field) {
		const columns = field[0].map((dot,index) => index).join(' ');
		const dots = field.reduce((acc, row, rowIndex) => {
			acc += `${rowIndex}  ${row.join(' ')}\n`;
			return acc;
		}, '');

		return `   ${columns}\n\n${dots}`;
	}
}