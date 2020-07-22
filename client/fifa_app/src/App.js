import React from 'react';
import './App.css';
import Chart from './components/Chart';
import playersSortedByAgeAscd from './data/playersData';
import Button from '@material-ui/core/Button';
import RangeSlider from './UI/RangeSlider';


const App = () => {
	const [players, setPlayers] = React.useState(playersSortedByAgeAscd);
	const [playersInCurrentAgeRange, setPlayersInCurrentAgeRange] = React.useState([]);
	const [wageRange, setWageRange] = React.useState({ min: 0, max: 100 });
	const [ageRange, setAgeRange] = React.useState({});
	const [disabledButton, setDisabledButton] = React.useState(false);

	const sliderValueChangedHandler = (minValue, maxValue) => {
		setWageRange({ min: minValue, max: maxValue });
	};

	const showPlayersHandler = async () => {
		setDisabledButton(true);
		var url = new URL('http://localhost:5000/players');

		var params = { minAge: 15, maxAge: 20, minWage: 0, maxWage: 100 };
		// 	const response = await fetch('http://localhost:5000/players', { qs: { a: 1, b: 2 } });

		// const resJson = await response.json();
		// console.log(resJson);

		let intervals = [];

		//prepare the age group data
		for (let i = 15; i < 30; i++) {
			intervals.push({ minAge: i, maxAge: i + 5 });
		}

		let delay = 3000;
		for (let i = 0; i < intervals.length; i++) {
			let [minAge, maxAge] = [intervals[i].minAge, intervals[i].maxAge];
			let [minWage, maxWage] = [wageRange.min, wageRange.max];

			params.minAge = minAge;
			params.maxAge = maxAge;
			params.minWage = minWage;
			params.maxWage = maxWage;

			url.search = new URLSearchParams(params).toString();

			const response = await fetch(url);

			const resJson = await response.json();
			//get players in relevant ages
			// let playerz = players.filter(
			// 	(player) =>
			// 		player.Age >= minAge &&
			// 		player.Age <= maxAge &&
			// 		player.Wage >= wageRange.min &&
			// 		player.Wage <= wageRange.max
			// );

			// playerz = playerz.sort(() => Math.random() - Math.random()).slice(0, 30);

			console.log(resJson);
			setTimeout(() => {
				setAgeRange({ min: minAge, max: maxAge });
				setPlayersInCurrentAgeRange(resJson);
			}, delay * i);
		}
	};
	return (
		<div className="App" style={{ marginBottom: '12vw', marginTop: '1vw', marginLeft: '12vw', marginRight: '16vw' }}>
			<Chart
				players={playersInCurrentAgeRange}
				onShowPlayers={showPlayersHandler}
				ageRanges={{ min: ageRange.min, max: ageRange.max }}
				wageRanges={{ min: wageRange.min, max: wageRange.max }}
				onSliderChanged={sliderValueChangedHandler}
			/>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<RangeSlider onSliderChanged={sliderValueChangedHandler} />
			</div>
			<Button variant="contained" color="primary" onClick={showPlayersHandler} >
				Play</Button>
		</div>
	);
};

export default App;
