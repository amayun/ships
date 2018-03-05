import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';
import './style.css';

const b = block('game-over');

export default class GameOver extends Component {
	static propTypes = {
		onRestart: PropTypes.func
	};

	render() {
		return (
			<div className={b()}>
				<h1>All ships are destroyed</h1>
				<button className={b('button')()} onClick={this.props.onRestart}>Restart</button>
			</div>
		)
	}
}