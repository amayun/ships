import React, {Component} from 'react';
import Ships from './components/ships';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
				</header>
				<Ships availableShips={['L_SHAPE', 'I_SHAPE', 'DOT_SHAPE', 'DOT_SHAPE']}/>
			</div>
		);
	}
}

export default App;
