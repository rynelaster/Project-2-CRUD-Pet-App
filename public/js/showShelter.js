
//method declarations
const apiKey = '?format=json&key=4514687905f37186817bdb9967ab8c9f'
const getShelter = 'shelter.getPets';
let shelterId = 'IA230';



const petSnapshot = (data) => {
	// console.log(data);
	for (let i = 0; i < data.petfinder.pets.pet.length; i++) {
		let $listContainer = $('#pet-listings');
		let $newA = $('<a>').attr('class', 'listings').text(data.petfinder.pets.pet[i].name.$t).attr('href', '/showpet/' + data.petfinder.pets.pet[i].id.$t);
		$newA.appendTo($listContainer);
		let $newImg = $('<img>').attr('src', data.petfinder.pets.pet[i].media.photos.photo[0].$t);
		$newImg.appendTo($newA);
	}
}




$.ajax({
	url: 'http://api.petfinder.com/'+ getShelter + apiKey + '&id=' + shelterId + '&status=A&callback=?',
	type: 'GET',
	dataType: 'JSON',
	success: function(data){

		// console.log(data, ' this is data')
		petSnapshot(data);
		console.log(data);
	},
	error: function(err){

		console.log(err);
	}
})