let animalClass = document.getElementsByClassName('animal-picture')

const numberOfPhotos = animalClass.length;

// the id of the photo currently showing
let photoShowingNow = 1;

// when page first loads show (= take away .hidden class) from the first photo
document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden');

document.getElementById('left').addEventListener('click', () => {

	if (photoShowingNow == 1) {

		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// Show the last photo
		document.getElementById('animal-photo-' + numberOfPhotos).classList.remove('hidden');

		photoShowingNow = 6;
	} else {

		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden')

		// decrease value of photoShowingNow
		photoShowingNow = photoShowingNow -1; 

		// photoShowingNow
		document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden')
	}
})

// show next photo in queue
document.getElementById('right').addEventListener('click', () => {

	// if photoShowingNow = photoCounter {
	if (photoShowingNow == numberOfPhotos) {

		// hide the last photo -- works becasuse the value of photoShowingNow is the last one
		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// show the first photo
		document.getElementById('animal-photo-' + '1').classList.remove('hidden');

		/*
		this will do 2 things:
		1: make the if statement false next time
		2: make the app state data correct so that our else statement will continue to work the way we want 
		*/
		photoShowingNow = 1;
			
	} else {

		// hide photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// increase value of photoShowingNow
		photoShowingNow = photoShowingNow + 1; // photoShowingNow++ 

		// show photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden');

	}
})

//when photos of get to last photo, loop back around to first photo 



















