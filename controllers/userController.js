const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');

//remember to require the Model here

// router.route('/login')
// 	.get((req, res) => {

// 		res.send('log in fam');
// 	})




// // LOGIN ROUTE
// router.get('/login', (req, res) =>{
// 	res.render('/login.ejs', (req, res)=>{
// 		User.findOne({username: req.body.username}, (err, user)=>{
router.get('/login', (req, res)=>{
	res.render('login.ejs', {message: req.session.message})
})

router.post('/login', (req, res)=>{
	User.findOne({username: req.body.username}, (err, user)=>{

			if(user){

				if(bcrypt.compareSync(req.body.password, user.password)){
					req.session.username = req.body.username;
					req.session.logged= true,
					req.session.message = '';

					res.redirect('/')

				}else{
					req.session.message = "Username or Password are incorrect"
					res.redirect('/users/login')
				}

			}else{
				console.log(err, 'there was an error')
				req.session.message = "Username or Password are incorrect"
				res.redirect('/users/login')
		}
	})
})

// LOGOUT
router.get('/logout', (req, res)=>{
	req.session.destroy((err)=>{
		if(err){

		}else{
			res.redirect('/home.ejs')
		}
	})
})
// REGISTRATION ROUTE

router.get('/registration', (req, res)=>{
	console.log(req.session)
	res.render('registration.ejs')
})

router.post('/registration', (req, res)=>{

	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

	// Creating an entry for our db with the password hash

	const userDatabaseEntry ={
		username: req.body.username,
		password: passwordHash
	};

	User.create(userDatabaseEntry, (err, user)=>{
		console.log(user, ' this is our user')

		// Now that the user is created, we need to set the session
		console.log(req.session, ' this is in the post route')
		req.session.username = req.body.username;
		req.session.logged = true;
		res.send('You have successfully registerd. Go find a pet!')
	})
})






















module.exports = router;