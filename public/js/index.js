let ranPet = 'pet.getRandom';
let $headerName = $('#petHeader');

$.ajax({
	url: 'http://api.petfinder.com/'+ ranPet + '?format=json&key=4514687905f37186817bdb9967ab8c9f&output=basic&callback=?',
	type: 'GET',
	dataType: 'JSON',
	success: function(data){
		console.log(data, ' this is data')
		$headerName.text(data.petfinder.pet.name.$t);
	},
	error: function(err){
		console.log(err)
	}
})


// $.ajax({
// 	url: 'http://api.petfinder.com/my.method?format=json&key=4514687905f37186817bdb9967ab8c9f&output=basic&callback=?',
// 	type: 'GET',
// 	dataType: 'JSON',
// 	success: function(data){
// 		console.log(data, ' this is data')
// 	},
// 	error: function(err){
// 		console.log(err)
// 	}
// })