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


//cache??
let userLocation;

//controllers & models
const userController = require('./controllers/userController.js');
app.use('/users', userController);

// const savedPetsController = require('./controllers/savedPetsController');
// app.use('/savedpets', savedPetsController);






app.get('/', (req, res) => {

	request('http://api.petfinder.com/pet.getRandom?format=json&key=4514687905f37186817bdb9967ab8c9f&output=basic', (err, response, body) => {
		if (err) {

			console.error(err);
		}
		else {

			const json = JSON.parse(body);

			res.render('home.ejs', {

				data: json.petfinder.pet
			})
		}
	})
})


app.post('/results/search', (req, res) => {

	let searchObj = req.body;

	let searchStr = '';

	req.session.shelterList = [];

	for (let key in searchObj) {
		if (searchObj[key] != 'All' && searchObj[key] != '') {

			searchStr += '&' + key + '=' + searchObj[key]
		}
	}

	console.log(searchStr);

	request('http://api.petfinder.com/pet.find?format=json&key=4514687905f37186817bdb9967ab8c9f' + searchStr, (err, response, foundPets) => {

		const json = JSON.parse(foundPets)


		/* WORKING ON LOOPING AND MAKING API REQUESTS BASED ON SHELTERID TO PUT ADDITIONAL INFORMATION IN RESULTS PAGE */


		// for (let i = 0; i < json.petfinder.pets.pet.length; i++) {
		// 	if (req.session.shelterList.indexOf(json.petfinder.pets.pet[i].shelterId.$t) > -1) {
		// 		//the shelter has been 
		// 	}
		// 	else {
		// 		req.session.shelterList.push(json.petfinder.pets.pet[i].shelterId.$t)
		// 	}
		// }

		// const foo = json.petfinder.pets.pet[0].shelterId.$t;

		// request('http://api.petfinder.com/shelter.get?format=json&key=4514687905f37186817bdb9967ab8c9f&id=' + foo, (err, response, foundShelter) => {

		// 	res.send(foundShelter)
		// })




		/* TRYING TO GET SORT BY DATE WORKING */

		// const dateSorted = [];

		// for (let i = 0; i < json.petfinder.pets.pet.length; i++) {
		// 	dateSorted.push(json.petfinder.pets.pet[i]);
		// }

		// dateSorted.sort((a, b) => {
		// 	return new Date(a.lastUpdate.$t) - new Date(b.lastUpdate.$t);
		// })

		// setTimeout(() => {
		// 	console.log(dateSorted);
		// }, 3000)




		
		// res.send(json)
		res.render('results.ejs', {

			pets: json.petfinder.pets.pet
		})

	})

})


app.get('/search', (req, res) => {
	console.log(req.session.location);
	if (req.session.location) {
		res.render('searchall.ejs', {

			location: req.session.location
		})
	}
	else {
		res.redirect('/');
	}
})


app.post('/search', (req, res) => {

	req.session.location = req.body.location

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
					location: req.session.location,
					animal: species
				})
			}
		})
	}	
	else {

		res.render('searchall.ejs', {

			location: req.session.location
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