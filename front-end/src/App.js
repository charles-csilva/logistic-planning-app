import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [points, setPoints] = useState('');
  useEffect(() => {
    setTimeout(async () => {
      const result = await axios.get('http://localhost:9000/api/orders/list');
      const pointsArray = (result.data.map(item => item.address));
      const pointsQuery = pointsArray.map(([lat, long]) => `point=${lat}%2C${long}`).join('&');
      debugger;
      setPoints(pointsQuery);
    }, 5000);
  });
  return (
    <div className="App">
      <h1>Logistic Planning</h1>
      <div style={{ height: '80vh', width: '80vw' }}>
        <iframe
          title="Map"
          // src={`http://localhost:8989/maps/?point=43.655515%2C-79.388387&point=43.652628%2C-79.394288`} 
          src={`http://localhost:8989/maps/?${points}`} 
          height="100%" 
          width="100%" >
        </iframe>
      </div>
    </div>
  );
};

export default App;