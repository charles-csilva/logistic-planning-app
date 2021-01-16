import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteMapComponent } from './route-map/route-map.component';

const App = () => {
	const [shipmentList, setShipmentList] = useState([]);
	useEffect(() => {
		setInterval(async () => {
			const result = await axios.get('http://localhost:9000/api/shipment/list');
			const shipmentList = result.data;
			setShipmentList(shipmentList);
		}, 5000);
	}, []);
	return (
		<div className="App">
			<h1>Logistic Planning</h1>
			{shipmentList.map(shipment => (
				<div key={shipment.id} style={{ height: '50vh', width: '50vw' }}>
					<p></p>
					<RouteMapComponent points={shipment.points} />
				</div>
			))}
		</div>
	);
};

export default App;
