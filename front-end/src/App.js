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
			{shipmentList.map((shipment, index) => (
				<div
					key={shipment.id}
					style={{
						height: '80vh',
						width: '80vw',
						border: '2px gray solid',
						borderRadius: 5,
						margin: 10,
					}}
				>
					<p>{`Route ${index} (${shipment.id})`}</p>
					{shipment.status === 'ROUTING-PENDING' && <h2>Optimizing route...</h2>}
					{shipment.status === 'SOLVED' && (
						<RouteMapComponent
							points={shipment.route.reduce((pointsSorted, currPointIndex) => {
								pointsSorted.push(shipment.points[currPointIndex]);
								return pointsSorted;
							}, [])}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default App;
