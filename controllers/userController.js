const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');



//login route to render the page
router.get('/login', (req, res)=>{

	res.render('login.ejs', {

		message: req.session.message,
		location: req.session.location,
		logged: req.session.logged,
		username: req.session.username
	})
})


//the login form posts to this route, checking the database for a user object with a matching name and checking the pw with bcrypt
router.post('/login', (req, res)=>{

	User.findOne({username: req.body.username}, (err, user)=>{

			if (user) {

				if (bcrypt.compareSync(req.body.password, user.password)) {
					req.session.username = req.body.username;
					req.session.logged = true,
					req.session.message = '';

					res.redirect('/')

				} 
				else {
					req.session.message = "Username or Password are incorrect"
					res.redirect('/users/login')
				}

			}
			else {
				console.log(err, 'there was an error')
				req.session.message = "Username or Password are incorrect"
				res.redirect('/users/login')
		}
	})
})

// log out route that simply destroys session data and redirects home
router.get('/logout', (req, res)=>{
	req.session.destroy((err)=>{
		if (err) {

		}
		else {

			res.redirect('/')
		}
	})
})


// registration route to display the register page
router.get('/registration', (req, res)=>{

	// console.log(req.session)
	res.render('registration.ejs', {

		location: req.session.location,
		logged: req.session.logged,
		username: req.session.username
	})
})


//creates a user model
router.post('/registration', (req, res)=>{

	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));


	const userDatabaseEntry = {

		username: req.body.username,
		password: passwordHash
	};

	User.create(userDatabaseEntry, (err, user)=>{

		console.log(user, ' this is our user')

		req.session.username = req.body.username;
		req.session.logged = true;
		res.redirect('/');
	})
})









module.exports = router;