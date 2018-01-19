const express = require('express');
const app = express();




//middleware
app.use(express.static('public'))



app.get('/', (req, res) => {

	res.send('the root');
})




app.get('/pets', (req, res) => {
	res.render('index.ejs')
})





app.listen(3000, () => {
	console.log('now listening on port 3000')
})