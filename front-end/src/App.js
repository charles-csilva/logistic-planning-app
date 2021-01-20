import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteMapComponent } from './route-map/route-map.component';
import 'bootstrap/dist/css/bootstrap.min.css';

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
		<div className="App m-2 mx-5">
			<div className="d-flex flex-row justify-content-center">
				<h1>Logistic Planning</h1>
			</div>
			<div className="d-flex flex-row justify-content-center">
				{shipmentList.length === 0 && <p>Fetching data, please wait...</p>}
			</div>
			<div className="main-content">
				{shipmentList.map((shipment, index) => (
					<div className="default-box-shadow my-5 p-4" key={shipment.id}>
						<div className="d-flex flex-row justify-content-center">
							<h2>{`Route ${index} (${shipment.id})`}</h2>
						</div>
						<div
							className="d-flex flex-row justify-content-center"
							style={{ height: '80vh' }}
						>
							{shipment.status === 'ROUTING-PENDING' && (
								<p>Optimizing route...</p>
							)}
							{shipment.status === 'SOLVED' && (
								<RouteMapComponent
									points={shipment.route.reduce(
										(pointsSorted, currPointIndex) => {
											pointsSorted.push(shipment.points[currPointIndex]);
											return pointsSorted;
										},
										[]
									)}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
