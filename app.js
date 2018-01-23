const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const methodOverride = require('method-override')

require('./db/db.js');




//middleware
app.use(express.static('public'))

app.use(session({
	secret: 'The super secret secret string',
	resave: false,
	saveUninitialized: false
}))

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(methodOverride('_method'))


//controllers & models
const userController = require('./controllers/userController.js');
app.use('/users', userController);

// const savedPetsController = require('./controllers/savedPetsController');
// app.use('/savedpets', savedPetsController);



//cache??
let userLocation;


app.get('/', (req, res) => {

	request('http://api.petfinder.com/pet.getRandom?format=json&key=4514687905f37186817bdb9967ab8c9f&output=basic', (err, response, body) => {
		if (err) {

			console.error(err);
		}
		else {

			let json = JSON.parse(body);

			res.render('home.ejs', {

				data: json.petfinder.pet
			})
		}
	})
})


app.post('/results/search', (req, res) => {

	let searchObj = req.body;

	let searchStr = '';

	for (let key in searchObj) {
		if (searchObj[key] != 'All' && searchObj[key] != '') {

			searchStr += '&' + key + '=' + searchObj[key]
		}
	}

	console.log(searchStr);

	request('http://api.petfinder.com/pet.find?format=json&key=4514687905f37186817bdb9967ab8c9f' + searchStr, (err, response, foundPets) => {

		let json = JSON.parse(foundPets)

		// for (let i = 0; i < json.petfinder.pets.pet.length; i++) {

		// }

		// console.log(json.petfinder.pets.pet[0])

		// res.send(json)
		res.render('results.ejs', {

			pets: json.petfinder.pets.pet
		})

	})

})


app.get('/search', (req, res) => {
	console.log(userLocation);
	if (userLocation) {
		res.render('searchall.ejs', {

			location: userLocation
		})
	}
	else {
		res.redirect('/');
	}
})


app.post('/search', (req, res) => {

	userLocation = req.body.location

	if (req.body.animal != 'All') {

		let species = req.body.animal;

		request('http://api.petfinder.com/breed.list?format=json&key=4514687905f37186817bdb9967ab8c9f&animal='+ species, (err, response, foundBreeds) => {
			if (err) {

				console.error(err);
			}
			else {

				let json = JSON.parse(foundBreeds);

				res.render('search.ejs', {

					breeds: json.petfinder.breeds.breed,
					location: userLocation
				})
			}
		})
	}	
	else {

		res.render('searchall.ejs', {

			location: userLocation
		});
	}
})



//  Route for showing animals when clicked on from SRP(search results page)
app.get('/view/pet/:id', (req, res)=>{

	request('http://api.petfinder.com/pet.get?format=json&key=4514687905f37186817bdb9967ab8c9f&id=' + req.params.id,(err, response, foundAnimal)=>{

		let json = JSON.parse(foundAnimal);
		console.log(json);
	


		res.render('showPet.ejs', {
			data: json.petfinder.pet})
	})
});



app.get('/shelter', (req, res) => {

	res.render('showShelter.ejs');
})


app.get('*', (req, res) => {

	res.send('404 page not found');
})



app.listen(3000, () => {
	console.log('now listening on port 3000')
})