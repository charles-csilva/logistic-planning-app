export const RouteMapComponent = ({ points }) => {
	const pointsQueryParams = points
		.map(([lat, lng]) => `point=${lat}%2C${lng}`)
		.join('&');
	return (
		<iframe
			title="Map"
			src={`http://localhost:8989/maps/?${pointsQueryParams}`}
			height="100%"
			width="100%"
		></iframe>
	);
};
