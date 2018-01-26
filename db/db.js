const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/petfinder';

mongoose.connect(mongoUri);

mongoose.connection.once('open', (req, res) => {
	console.log('db connection open');
})

mongoose.connection.on('error', (error) => {
	console.log('mongodb is error', error);
})