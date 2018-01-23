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
app.use('/user', userController);

// const savedPetsController = require('./controllers/savedPetsController');
// app.use('/saved', savedPetsController);



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


app.get('/search', (req, res) => {

	res.render('search.ejs');
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