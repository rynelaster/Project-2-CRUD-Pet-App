console.log('linked up');


//class in css that's displaying: none (.hidden)

// variable that contains the first id

// way to know when your at the last one
// the length that array

// WHAT AM I TRYING TO DO RIGHT NOW

//figure out which youre going to hide 

// console.log(arrayOfImages, ' this is array of images')


// Look up how to grab the url in plain javascript window. something will give you the url
// you'll have to grab the id out of the url and add it the url in the ajax

// const petPhotoId = (id)=>{
// 	window.location.href("photos.petfinder.com/photos/pets/39302034")
// }
// $.ajax({
// 	url: '/pet/images/' + (id) =>,
// 	type: "Get",
// 	dataType: 'json',
// 	success: (arrayOfImages) => {
// 		console.log(arrayOfImages)
// 	},
// 	error: (err) => {
// 		console.log(err)
// 	}
// })



let animalClass = document.getElementsByClassName('animal-picture')
	console.log(animalClass)

const numberOfPhotos = animalClass.length;


// the id of the photo currently showing
let photoShowingNow = 1;

// when page first loads show (= take away .hidden class) from the first photo
document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden');




document.getElementById('left').addEventListener('click', ()=>{
	// console.log('hit left')

	if(photoShowingNow == 1) {
		// do the weird thing


			document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// 	// Show the last photo
			document.getElementById('animal-photo-' + numberOfPhotos).classList.remove('hidden');


			photoShowingNow = 6;



	} else {

		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden')
				// decrease value of photoShowingNow
		photoShowingNow = photoShowingNow -1; // photoShowingNow--
		// show photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden')
	}
	console.log('\n\n\nphotoShowingNow is now: ', photoShowingNow);
})

//show next photo in queue
document.getElementById('right').addEventListener('click', ()=>{

	// if photoShowingNow ~= photoCounter {
	if(photoShowingNow == numberOfPhotos) {

		// hide the last photo -- works becasuse the value of photoShowingNow is the last one
		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// show the first photo
		document.getElementById('animal-photo-' + '1').classList.remove('hidden');

		// this will do 2 things:
		//1: make the if statement false next time
		// 2 make the app state data correct so that our else statement will continue to work the way we want
		photoShowingNow = 1;
			
	} else {

		// hide photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// increase value of photoShowingNow
		photoShowingNow = photoShowingNow + 1; // photoShowingNow++ 

		// show photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden');

	}
	console.log('\n\n\nphotoShowingNow is now: ', photoShowingNow);

})

//when photos of get to last photo, loop back around to first photo 



















