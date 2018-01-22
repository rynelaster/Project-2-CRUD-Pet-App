const mongoose = require('mongoose');

const savedPetsSchema = new mongoose.Schema({
	petId: String,
	shelterId: String,
	name: String,
	photo: String,
	age: Number,
	species: String,
	breed: String,
	gender: String
})

const SavedPets = mongoose.model('SavedPets', savedPetsSchema);

module.exports = SavedPets;