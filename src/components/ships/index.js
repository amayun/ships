import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';
import Ship from '../ship';
import GameOver from '../game-over';
import {times, rand} from '../../utils/function';
import matrix from '../../utils/matrix';
import Field, {DOT_SHIP, DOT_DAMAGED, DOT_MISS, DOT_EMPTY, cellTurns, DOT_DESTROYED} from '../field';

const b = block('ships');

const SHOOTING_INTERVAL = 200;

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
		this.ships = [];
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			field: this._getFieldWithRandomlyPlacedShips(),
			shooting: false,
			gameOver: false
		}
	}

	componentDidMount() {
		this.restart();
	}

	render() {
		const {field, gameOver, shooting} = this.state;
		return (
			<div className={b()}>
				{<Field field={field}/>}
				{gameOver && <GameOver onRestart={this.restart}/>}
				{!shooting && <button onClick={this._startShooting}>Start shooting</button>}
			</div>
		);
	}

	restart = () => {
		this.ships = [];
		this.setState(this.getInitialState());
	};

	_generateEmptyField() {
		const {fieldSize} = this.props;
		return times(() => Array(fieldSize).fill(0), fieldSize)
	}

	_getFieldWithRandomlyPlacedShips() {
		const {availableShips} = this.props;
		let newField = this._generateEmptyField();

		availableShips.forEach(shipType => {
			const ship = new Ship(shipType);
			ship.rotateRandomly();

			newField = this._placeShipRandomly(newField, ship);
			this.ships.push(ship);
		});

		return newField
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

		matrix.forEach(ship.field, (dot, offsetX, offsetY) => {
			let x = ship.x + offsetX;
			let y = ship.y + offsetY;
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

	_startShooting = () => {
		const {gameOver, shooting} = this.state;

		if (!shooting) {
			this.setState({shooting: true});
		}

		if(!gameOver) {
			this._randomShot();
			setTimeout(() => {
				this._startShooting()
			}, SHOOTING_INTERVAL)
		}
	};

	_randomShot = () => {
		const {fieldSize} = this.props;
		const {field} = this.state;

		const shotX = rand(0, fieldSize - 1);
		const shotY = rand(0, fieldSize - 1);

		if (field[shotY][shotX] === DOT_SHIP || field[shotY][shotX] === DOT_EMPTY) {
			this._shot(shotX, shotY);
		} else {
			const flatField = matrix.flatMap(field, dot => dot);
			let flatShot = shotY * fieldSize + shotX;

			for (let delta = 0; delta <= fieldSize * fieldSize; delta++) {
				if (checkDot(flatField[flatShot + delta])) {
					flatShot += delta;
					break;
				}
				if (checkDot(flatField[flatShot - delta])) {
					flatShot -= delta;
					break;
				}
			}

			this._shot(flatShot % fieldSize, Math.floor(flatShot/fieldSize));
		}
		
		function checkDot(dot) {
			return dot === DOT_SHIP || dot === DOT_EMPTY
		}
	};

	_shot(x, y) {
		const {field} = this.state;
		let newField = matrix.clone(field);
		const dot = newField[y][x];
		newField[y][x] = cellTurns[dot];

		this.setState({field: newField}, () => {
			if (dot === DOT_SHIP) {
				this._checkShips()
			}
		});
	}

	_checkShips() {
		const {field} = this.state;
		let allShipsAreDestroyed = true;

		this.ships.forEach(ship => {
			if (!ship.destroyed && this._checkIfShipIsDestroyed(field, ship)) {
				ship.destroyed = true;
				this._setBlastZoneAroundDestroyedShip(ship);
			}

			if (!ship.destroyed) {
				allShipsAreDestroyed = false
			}
		});

		if (allShipsAreDestroyed) {
			this.setState({gameOver: true})
		}
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

	_setBlastZoneAroundDestroyedShip(ship) {
		const {field} = this.state;

		if (!ship.destroyed) {
			return field;
		}

		const newField = matrix.clone(field);

		this._forEachDotAroundShip(newField, ship, (dot, x, y) => {
			if (dot !== DOT_DAMAGED) {
				newField[y][x] = DOT_MISS;
			}
		});

		matrix.forEach(ship.field, (dot, offsetX, offsetY) => {
			if(dot) {
				newField[ship.y + offsetY][ship.x + offsetX] = DOT_DESTROYED;
			}
		});

		this.setState({field: newField});
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