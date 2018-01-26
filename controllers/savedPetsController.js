const express = require('express');
const router = express.Router();
const SavedPets = require('../models/savedPets.js');
const User = require('../models/users.js');



//get route for displaying saved pets, pretty simple because unless you type the route manually into the address bar, theres no way to access this page without being logged in first. finds the logged in user and populates the data based on what is stored in that user's saved pets array
router.get('/', (req, res) => {

	User.findOne({username: req.session.username}, (err, foundUser) => {

		// console.log(foundUser);

		res.render('savedPets.ejs', {

			saved: foundUser.savedPets,
			location: req.session.location,
			logged: req.session.logged,
			username: req.session.username
		})
	})
})

//delete route for removing objects from the saved pets mongodb collection and the logged in user's saved pets array
router.delete('/:id', (req, res) => {

	SavedPets.findByIdAndRemove(req.params.id, (err, removedSaved) => {

		User.findOne({

			username: req.session.username
		}, (err, foundUser) => {

			foundUser.savedPets.id(req.params.id).remove();

			foundUser.save((err, data) => {

				res.redirect('/savedpets');
			})
		})
	})

})








module.exports = router;