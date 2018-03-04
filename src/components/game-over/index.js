import React, {Component} from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn';

const b = block('game-over');

export default class GameOver extends Component {
	static propTypes = {
		onRestart: PropTypes.func
	};

	render() {
		return (
			<div className={b()}>
				<h1>All ships are destroyed</h1>
				<button onClick={this.props.onRestart}>Restart</button>
			</div>
		)
	}
}