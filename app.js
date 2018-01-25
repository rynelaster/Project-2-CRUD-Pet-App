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
	secret: 'The super secret secret top secret secretive string',
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

const savedPetsController = require('./controllers/savedPetsController');
app.use('/savedpets', savedPetsController);




//home page route
app.get('/', (req, res) => {

	console.log(req.session.location)

	req.session.message = '';

	request('http://api.petfinder.com/pet.getRandom?format=json&key=4514687905f37186817bdb9967ab8c9f&output=basic', (err, response, body) => {
		if (err) {

			console.error(err);
		}
		else {

			const json = JSON.parse(body);

			res.render('home.ejs', {

				data: json.petfinder.pet,
				location: req.session.location,
				logged: req.session.logged,
				username: req.session.username
			})
		}
	})
})


app.post('/results/search', (req, res) => {

	let searchObj = req.body;

	let searchStr = 'http://api.petfinder.com/pet.find?format=json&key=4514687905f37186817bdb9967ab8c9f';

	for (let key in searchObj) {
		if (searchObj[key] != 'All' && searchObj[key] != '') {

			searchStr += '&' + key + '=' + searchObj[key]
		}
	}

	console.log(searchStr);

	request(searchStr, (err, response, foundPets) => {

		if (err) {
			console.error(err);
		}
		const json = JSON.parse(foundPets)
		
		// console.log(json.petfinder.lastOffset.$t)

		res.render('results.ejs', {

			pets: json.petfinder.pets.pet,
			location: req.session.location,
			logged: req.session.logged,
			username: req.session.username,
			query: searchStr
		})

	})

})


app.get('/refine/search', (req, res) => {

	if (!req.session.location) {

		res.redirect('/');
	}
	else {
		res.render('refine.ejs', {

			location: req.session.location,
			logged: req.session.logged,
			username: req.session.username
		})
	}
})


app.post('/refine/search', (req, res) => {

	if (!req.session.location) {

		req.session.location = req.body.location
	}

	console.log(req.session.location)

	res.render('refine.ejs', {

		location: req.session.location,
		logged: req.session.logged,
		username: req.session.username
	})
})


app.get('/search', (req, res) => {
	console.log(req.session.location);
	if (req.session.location) {
		res.render('searchall.ejs', {

			location: req.session.location,
			logged: req.session.logged,
			username: req.session.username
		})
	}
	else {
		res.redirect('/');
	}
})


app.get('/search/:id', (req, res) => {

	if (req.session.location) {

		let species = req.params.id;

		request('http://api.petfinder.com/breed.list?format=json&key=4514687905f37186817bdb9967ab8c9f&animal='+ species, (err, response, foundBreeds) => {
			if (err) {

				console.error(err);
			}
			else {

				let json = JSON.parse(foundBreeds);

				res.render('search.ejs', {

					breeds: json.petfinder.breeds.breed,
					location: req.session.location,
					logged: req.session.logged,
					username: req.session.username,
					animal: species
				})
			}
		})
	}
	else {

		res.redirect('/')
	}
})


app.get('/clearloc', (req, res) => {

	req.session.location = null;

	res.redirect('/');
})



//  Route for showing animals when clicked on from SRP(search results page)
app.get('/view/pet/:id', (req, res)=>{

	request('http://api.petfinder.com/pet.get?format=json&key=4514687905f37186817bdb9967ab8c9f&id=' + req.params.id, (err, response, foundAnimal) => {

		let json = JSON.parse(foundAnimal);
		// console.log(json);
		console.log('------------------------------------------')
		console.log(json.petfinder.pet, ' this is data object')
		
		console.log('------------------------------------------')

		res.render('showPet.ejs', {

			data: json.petfinder.pet,
			location: req.session.location,
			logged: req.session.logged,
			username: req.session.username
		})
	})
});


app.get('/pet/images/:id', (req, res) => {
		request('http://api.petfinder.com/pet.get?format=json&key=4514687905f37186817bdb9967ab8c9f&id=' + req.params.id, (err, response, foundAnimal) => {

		let json = JSON.parse(foundAnimal);
		// console.log(json);
		console.log('------------------------------------------')
		console.log(json.petfinder.pet, ' this is data object')
		
		console.log('------------------------------------------')

		// res send the array of images
	
	})




})




app.get('/shelter', (req, res) => {

	res.render('showShelter.ejs');
})


app.get('*', (req, res) => {

	res.send('404 page not found');
})



app.listen(3000, () => {
	console.log('now listening on port 3000')
})