
//method declarations
const ranPet = 'pet.getRandom';


//jquery property declarations
const $headerName = $('#name');
const $img = $('#picture');
const $name = $('#name');
const $description = $('#description');
const $lastUpdate = $('#last-updated');
const $age = $('#age');
const $gender = $('#gender');
const $species = $('#species');
const $breed = $('#breed');
const $contactInfo = $('#contact-info');





const fillInfo = (data) => {

	$headerName.text(data.petfinder.pet.name.$t);
	$img.attr('src', data.petfinder.pet.media.photos.photo[3].$t);
	$description.text(data.petfinder.pet.description.$t);

	let d = new Date(data.petfinder.pet.lastUpdate.$t);
	$lastUpdate.text(d);

	$age.text(data.petfinder.pet.age.$t);
	$gender.text(data.petfinder.pet.sex.$t);
	$species.text(data.petfinder.pet.animal.$t);
	$breed.text(data.petfinder.pet.breeds.breed.$t);

}


// const contactInfo = (data) => {



// }


$.ajax({
	url: 'http://api.petfinder.com/pet.getRandom?format=json&key=4514687905f37186817bdb9967ab8c9f&output=basic&callback=?',
	type: 'GET',
	dataType: 'JSON',
	success: function(data){
		console.log(data, ' this is data')
		fillInfo(data);
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