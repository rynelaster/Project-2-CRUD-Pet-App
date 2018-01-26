const express = require('express');
const router = express.Router();
const SavedPets = require('../models/savedPets.js');
const User = require('../models/users.js');




router.get('/', (req, res) => {

	SavedPets.find({}, (err, allSaved) => {

		res.render('savedPets.ejs', {
			
			saved: allSaved,
			location: req.session.location,
			logged: req.session.logged,
			username: req.session.username
		})
	})

})


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