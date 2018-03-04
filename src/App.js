import React, {Component} from 'react';
import Ships from './components/ships';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Ships availableShips={['L_SHAPE', 'I_SHAPE', 'DOT_SHAPE', 'DOT_SHAPE']}/>
			</div>
		);
	}
}

export default App;
