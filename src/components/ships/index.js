import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Ships extends Component {
	static propTypes = {
		fieldSize: PropTypes.number
	};

	static defaulProps = {
		fieldSize: 10
	};

	constructor(props) {
		super(props);

		this.state = {
			field: this._genField(),
			availableShips: []
		}
	}

	render () {
		return (<div>{'sdrgdrf'}</div>)
	}

	_genField() {
		const {fieldSize} = this.props;
		return Array(fieldSize)
			.fill(null)
			.map(() => Array(fieldSize).fill(0))
	}

	_printField() {
		const {field} = this.state;

		field.reduce((acc, row) => {
			acc += row.toString() + '\n';
			return acc;
		},'')
	}
}