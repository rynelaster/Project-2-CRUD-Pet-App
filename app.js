const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const methodOverride = require('method-override')

require('dotenv').config()

//database
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




//controllers
const userController = require('./controllers/userController.js');
app.use('/users', userController);

const savedPetsController = require('./controllers/savedPetsController');
app.use('/savedpets', savedPetsController);


//models
const SavedPets = require('./models/savedPets.js')

const User = require('./models/users.js')


//home page route uses the get random pet method of the petfinder api to populate our landing page
app.get('/', (req, res) => {

	console.log(req.session.location)

	req.session.message = '';

	req.session.saveAlert = '';

	request('http://api.petfinder.com/pet.getRandom?format=json&key='+ API_KEY +'&output=basic', (err, response, body) => {
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


//the post route for when you first initiate a search. uses pet find api method, looping through key pair values of the form element that posted here to populate the end of the query. passes offset and search string when rendering the results page to allow us to use them to cycle through results
app.post('/results/search', (req, res) => {

	let searchObj = req.body;

	let searchStr = 'http://api.petfinder.com/pet.find?format=json&key='+ API_KEY;

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

				req.session.location = null;

				req.session.errlocation = 'Your location is invalid. Please enter a valid location.'

				res.redirect('/');
			}
		}
	})

})


//results post route for cycling through results using offset. uses pet find method again, this time passing the offset value through as an /:id so we can append it to the query
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


//a catch page for gathering form data to populate the 'breeds' dropdown menu (need it for cats & dogs). also catches location related errors and redirects
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


//same as the '/refine/search' get route, except with logic built in for saving the users' location temporarily in req.session
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


//the search form NOT filtered by either cats or dogs, so it doesnt need to populate a breeds field
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


//search page for either specifically cats or specifically dogs. uses :id to clarify either cat or dog and then appends that :id to the query to get the proper returned data
app.get('/search/:id', (req, res) => {

	if (req.session.location) {

		let species = req.params.id;

		request('http://api.petfinder.com/breed.list?format=json&key='+ API_KEY +'&animal='+ species, (err, response, foundBreeds) => {
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


//clears the saved session location and prompts the user to enter a new location.
app.get('/clearloc', (req, res) => {

	req.session.location = null;

	res.redirect('/');
})



//  Route for showing animals when clicked on from SRP(search results page) using the pet get api method
app.get('/view/pet/:id', (req, res)=>{

	request('http://api.petfinder.com/pet.get?format=json&key='+ API_KEY +'&id=' + req.params.id, (err, response, foundAnimal) => {

		const json = JSON.parse(foundAnimal);

		if (json.petfinder.pet == undefined) {

			req.session.errlocation = 'There was an error obtaining shelter records. Please start a new search :(';

			res.redirect('/')
		}
		else {
			// console.log(foundAnimal);

			// res.send(json.petfinder)

			res.render('showPet.ejs', {

				data: json.petfinder.pet,
				saveAlert: req.session.saveAlert,
				location: req.session.location,
				logged: req.session.logged,
				username: req.session.username
			})
		}

	
	})
})


//the save-a-pet post route, uses the pet's :id to append to pet get query, then finds the currently logged user and creates a new Saved Pet model. that model is pushed into the current users saved pets array and saved.
app.post('/view/pet/:id', (req, res) => {

	request('http://api.petfinder.com/pet.get?format=json&key='+ API_KEY +'&id=' + req.params.id, (err, response, foundAnimal) => {

		const json = JSON.parse(foundAnimal);
		// console.log(json);

		console.log(req.body)

		User.findOne({

			username: req.session.username
		}, (err, foundUser) => {

			// console.log(req.body, 'this is the passed data');

			SavedPets.create(req.body, (err, savedPet) => {

				foundUser.savedPets.push(savedPet);
				foundUser.save((err, data) => {

					req.session.saveAlert = 'Pet saved!';

					if (err) {
						console.error(err);
					}
					else {

						res.redirect('/view/pet/' + req.body.id);
					}
				})
			})
		})
	})
})


//route for browsing local shelters by name. uses the shelter find method of the api, appending session location to the query. checks against valid locations and redirects in the instace of a fail
app.get('/shelter/search', (req, res) => {

	request('http://api.petfinder.com/shelter.find?format=json&key='+ API_KEY +'&location=' + req.session.location, (err, response, foundShelters) => {
		if (err) {
			console.error(err)
		}
		else {

			const json = JSON.parse(foundShelters);

			if (json.petfinder.shelters == undefined) {

				req.session.errlocation = 'Your location is invalid. Please enter a valid location.'

				req.session.location = null;

				res.redirect('/');
			}
			else {

				res.render('shelterResults.ejs', {

					shelters: json.petfinder.shelters,
					location: req.session.location,
					logged: req.session.logged,
					username: req.session.username
				})
			}
		}
	})
})


//the view individual shelter route, using the shelter get api method. the ejs page this renders, 'showShelter.ejs', also has script tags on it implementing google maps, google geocode, and google places to generate a map with the shelters' location marked. this route also calls the shelter getpets api method to populate a mini display box within the shelter view container with some pets located at the shelter
app.get('/view/shelter/:id', (req, res) => {

	request('http://api.petfinder.com/shelter.get?format=json&key='+ API_KEY +'&id=' + req.params.id, (err, response, foundShelter) => {
		if (err) {
			console.error(err)
		}
		else {

			const json = JSON.parse(foundShelter)

			// res.send(json.petfinder.shelter);

			request('http://api.petfinder.com/shelter.getPets?format=json&key='+ API_KEY +'&count=5&id=' + req.params.id, (err, response, foundPets) => {

				if (err) {

					console.error(err)
				}
				else {

					const petsJson = JSON.parse(foundPets)

					// console.log(petsJson.petfinder);

					res.render('showShelter.ejs', {

						shelter: json.petfinder.shelter,
						pets: petsJson.petfinder.pets.pet,
						location: req.session.location,
						logged: req.session.logged,
						username: req.session.username
					})
				}
			})
		}
	})
})


//
app.get('/pet/images/:id', (req, res) => {
		request('http://api.petfinder.com/pet.get?format=json&key='+ API_KEY +'&id=' + req.params.id, (err, response, foundAnimal) => {

		let json = JSON.parse(foundAnimal);
		// console.log(json);

		console.log(json.petfinder.pet, ' this is data object')

		// res send the array of images
	
	})
})


//catch all 404 for epic fails
app.get('*', (req, res) => {

	res.send('404 page not found');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('now listening on port 3000')
})