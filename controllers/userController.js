const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//remember to require the Model here

router.route('/')
	.get((req, res) => {

		res.send('log in fam');
	})


module.exports = router;