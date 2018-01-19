const petfinder = require('petfinder')('4514687905f37186817bdb9967ab8c9f','e7b2338e6b063e0468dc53ef935c1548');
const express = require('express');
const app = express();






app.get('/', (req, res) => {

	petfinder.getBreedList('dog', function(err, breeds) {
	  	console.log(breeds)

	  	res.send('ur shit posted');
	});
})









app.listen(3000, () => {
	console.log('now listening on port 3000')
})