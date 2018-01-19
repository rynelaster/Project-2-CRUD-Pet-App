const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

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


//controllers
const userController = require('./controllers/userController.js');
app.use('/user', userController);



app.get('/', (req, res) => {

	res.send('the root');
})



app.get('/showpet', (req, res) => {

	res.render('showPet.ejs');
})



app.get('/showshelter', (req, res) => {

	res.render('showShelter.ejs')
})



app.get('*', (req, res) => {

	res.send('404 page not found');
})



app.listen(3000, () => {
	console.log('now listening on port 3000')
})