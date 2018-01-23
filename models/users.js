const mongoose = require('mongoose');

const SavedPets = require('./savedPets.js');

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	savedPets: [SavedPets.schema]
})

const User = mongoose.model('User', userSchema);

module.exports = User;