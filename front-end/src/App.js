import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteMapComponent } from './route-map/route-map.component';

const App = () => {
	const [points, setPoints] = useState([]);
	useEffect(() => {
		setTimeout(async () => {
			const result = await axios.get('http://localhost:9000/api/orders/list');
			setPoints(result.data.map(item => item.address.latLng));
		}, 10000);
	}, []);
	return (
		<div className="App">
			<h1>Logistic Planning</h1>
			<div style={{ height: '80vh', width: '80vw' }}>
				<RouteMapComponent points={points} />
			</div>
		</div>
	);
};

export default App;
