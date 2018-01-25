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

			if (!json.petfinder.pet.media.photos) {

				res.redirect('/');
			}

			res.render('home.ejs', {

				data: json.petfinder.pet,
				location: req.session.location,
				logged: req.session.logged,
				username: req.session.username,
				errlocation: req.session.errlocation
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
		else {

			const json = JSON.parse(foundPets);

			if (json.petfinder.pets != undefined) {

				// console.log(json.petfinder.lastOffset.$t)

				res.render('results.ejs', {

					pets: json.petfinder.pets.pet,
					location: req.session.location,
					logged: req.session.logged,
					username: req.session.username,
					offset: json.petfinder.lastOffset.$t,
					query: searchStr
				})
			}
			else {

				req.session.location = '';

				req.session.errlocation = 'Your location is invalid. Please enter a valid location.'

				res.redirect('/');
			}
		}
	})

})


app.post('/results/search/:id', (req, res) => {

	const searchStr = req.body.searchStr;

	request(searchStr + req.params.id, (err, response, foundPets) => {

		if (err) {
			console.error(err);
		}
		else {

			const json = JSON.parse(foundPets);

			console.log(json.petfinder.lastOffset.$t);

			res.render('results.ejs', {

				pets: json.petfinder.pets.pet,
				location: req.session.location,
				logged: req.session.logged,
				username: req.session.username,
				offset: json.petfinder.lastOffset.$t,
				query: searchStr
			})
		}
	})
})


app.get('/refine/search', (req, res) => {

	req.session.errlocation = '';

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

	req.session.errlocation = '';

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

		const json = JSON.parse(foundAnimal);
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
})



app.get('/shelter/search', (req, res) => {

	request('http://api.petfinder.com/shelter.find?format=json&key=4514687905f37186817bdb9967ab8c9f&location=' + req.session.location, (err, response, foundShelters) => {
		if (err) {
			console.error(err)
		}
		else {

			const json = JSON.parse(foundShelters);
			// res.send(json.petfinder);
			res.render('shelterResults.ejs', {

				shelters: json.petfinder.shelters,
				location: req.session.location,
				logged: req.session.logged,
				username: req.session.username
			})
		}
	})
})



app.get('/view/shelter/:id', (req, res) => {

	request('http://api.petfinder.com/shelter.get?format=json&key=4514687905f37186817bdb9967ab8c9f&id=' + req.params.id, (err, response, foundShelter) => {
		if (err) {
			console.error(err)
		}
		else {

			const json = JSON.parse(foundShelter)

			// res.send(json.petfinder);

			res.render('showShelter.ejs', {

				shelter: json.petfinder.shelter,
				location: req.session.location,
				logged: req.session.logged,
				username: req.session.username
			})
		}

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