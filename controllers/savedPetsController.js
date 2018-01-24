const express = require('express');
const router = express.Router();
const SavedPets = require('../models/savedPets.js');




router.get('/', (req, res) => {

	res.render('savedPets.ejs', {
		
		location: req.session.location,
		logged: req.session.logged,
		username: req.session.username
	})
})











module.exports = router;