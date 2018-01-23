const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');

//remember to require the Model here

// router.route('/login')
// 	.get((req, res) => {

// 		res.send('log in fam');
// 	})

router.get('/login', (req, res =>{
	res.render('/login', (req, res)=>{
		User.findOne(username: req.body.username), (err, user)=>{

			if(user){

				if(bcrypt.compareSync(req.body.password, user.password)){
					req.session.username = req.body.username;
					req.session.logged: true;
					req.session.message = '';

					res.redirect('/home')

				}else{
					req.session.message = "Username or Password are incorrect"
					res.redirect('/users/login')
				}

			}else{
				console.log(err, 'there was an error')
				req.session.message = "Username or Password are incorrect"
				
			}
		}
	})
}))
























module.exports = router;