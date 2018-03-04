import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';
import Ship from '../ship';
import {times, rand} from '../../utils/function';
import matrix from '../../utils/matrix';
import Field, {DOT_SHIP, DOT_DAMAGED, DOT_MISS, DOT_EMPTY} from '../field';

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
			started: false
		};

		this.ships = [];
	}

	componentDidMount() {
		this._placeShipsRandomly();
	}

	render() {
		const {field} = this.state;
		return (
			<div className={b()}>
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
		let newField = matrix.clone(field);

		availableShips.forEach(shipType => {
			const ship = new Ship(shipType);
			ship.rotateRandomly();

			newField = this._placeShipRandomly(newField, ship);
			this.ships.push(ship);
		});

		this.setState({field: newField});
	}

	_placeShipRandomly(field, ship) {
		const {fieldSize} = this.props;
		const retries = 30;

		for (let i = 0; i < retries; i++) {
			const x = rand(0, fieldSize - 1);
			const y = rand(0, fieldSize - 1);
			ship.setCoords(x, y);

			if (this._checkPossibleShipPosition(field, ship)) {
				return matrix.plus(field, ship.field, x, y);
			}
		}

		throw new Error('Can\'t place a ship randomly');
	}

	_checkPossibleShipPosition(field, ship) {
		let result = true;

		matrix.forEach(ship.field, (dot, offsetX, offestY) => {
			let x = ship.x + offsetX;
			let y = ship.y + offestY;
			if (field[y] === undefined || field[y][x] === undefined) {
				result = false;
			}
		});

		this._forEachDotAroundShip(field, ship, dot => {
			if (dot !== DOT_EMPTY) {
				result = false;
			}
		});

		return result
	}

	_handleCellClick = (oldValue, newValue, x, y) => {
		const {field} = this.state;
		let newField = matrix.clone(field);

		newField[y][x] = newValue;
		if (oldValue === DOT_SHIP) {
			newField = this._checkShips(newField)
		}

		this.setState({field: newField})
	};

	_checkShips(field) {
		let newField = field;

		this.ships.forEach(ship => {
			if (!ship.destroyed && this._checkIfShipIsDestroyed(field, ship)) {
				ship.destroyed = true;
				newField = this._setBlastZoneAroundDestroyedShip(field, ship);
			}
		});

		return newField;
	}

	_checkIfShipIsDestroyed(field, ship) {
		let result = true;
		matrix.forEach(ship.field, (dot, offsetX, offsetY) => {
			if (dot && field[ship.y + offsetY][ship.x + offsetX] !== DOT_DAMAGED) {
				result = false
			}
		});

		return result
	}

	_setBlastZoneAroundDestroyedShip(field, ship) {
		if (!ship.destroyed) {
			return field;
		}

		const newField = matrix.clone(field);

		this._forEachDotAroundShip(newField, ship, (dot, x, y) => {
			if (dot !== DOT_DAMAGED) {
				newField[y][x] = DOT_MISS;
			}
		});

		return newField;
	}

	_forEachDotAroundShip(field, ship, iteratee) {
		matrix.forEach(ship.field, (dot, offsetX, offsetY) => {
			if (dot) {
				for (let row = -1; row < 2; row++) {
					for (let col = -1; col < 2; col++) {
						const x = ship.x + offsetX + col;
						const y = ship.y + offsetY + row;

						if (field[y] !== undefined && field[y][x] !== undefined) {
							iteratee(field[y][x], x, y);
						}
					}
				}
			}
		});
	}
}