const petfinder = require('petfinder')('4514687905f37186817bdb9967ab8c9f','e7b2338e6b063e0468dc53ef935c1548');
const express = require('express');
const app = express();




//middleware
app.use(express.static('public'))



app.get('/', (req, res) => {



	petfinder.findShelter('Chicago', (err, shelters) => {

		console.log(shelters);

		res.render(shelters)
	})







	// petfinder.getRandomPet({}, (err, pet) => {
	//   	console.log(pet)

	//   	res.render('index.ejs', {
	//   		pic: pet.media.photos['1'].x
	//   	});
	// });
})



app.get('/pets', (req, res) => {
	res.render('index.ejs')
})





app.listen(3000, () => {
	console.log('now listening on port 3000')
})