
//method declarations
const getShelter = 'shelter.get';






$.ajax({
	url: 'http://api.petfinder.com/'+ getShelter + '?format=json&key=4514687905f37186817bdb9967ab8c9f&id=IL813&callback=?',
	type: 'GET',
	dataType: 'JSON',
	success: function(data){
		console.log(data, ' this is data')
	},
	error: function(err){
		console.log(err)
	}
})