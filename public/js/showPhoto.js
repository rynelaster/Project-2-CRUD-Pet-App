console.log('linked up');

//class in css that's displaying: none (.hidden)


// WHAT AM I TRYING TO DO RIGHT NOW

//figure out which youre going to hide 

// the id of the photo currently showing
let photoShowingNow = 0;

// when page first loads show (= take away .hidden class) from the first photo
document.getElementById('animal-photo-0').classList.remove('hidden');

document.getElementById('left').addEventListener('click', ()=>{
	console.log('hit left')

	//




})

document.getElementById('right').addEventListener('click', ()=>{
	console.log('hit right');

	//show next photo in queue

		// hide photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.add('hidden');

		// increase value of photoShowingNow
		photoShowingNow = photoShowingNow + 1; // photoShowingNow++ 

		// show photoShowingNow 
		document.getElementById('animal-photo-' + photoShowingNow).classList.remove('hidden')




})


