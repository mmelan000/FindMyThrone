let map, infoWindow;
var formError = document.querySelector('#error');
var searchForm = document.querySelector("#search");
var gottaGo = document.querySelector('#custom-map-control-button');
var searchButton = document.querySelector('#searchbox');
var docRecent = document.querySelector('#recent');
var poopJokesArray = ['Bake a loaf', 'Barbarians at the gate', 'Blow Mud', 'Bomb the Bowl', 'Chop a log', 'Cook a butt burrito', 'Curl some pipe', 'Do the Royal Squat', 'Doo the doo', 'Drop the kids off at the pool',
  'Dump a stump', 'Fill the peanut butter jar', 'Float a trout', 'Grow a Tail', 'Launch a Butt Shuttle', 'Launch a torpedo', 'Lay a brick', 'Make a deposit at the porcelain bank', 'Log an entry',
  'Make room for lunch', 'Offload some freight', 'Pack your underwear', 'Paint the bowl', 'Park some bark', 'Pinch a loaf', 'Plant some corn', "Poke the turtle's head out", "I'm Prairie Dogging",
  'Punish the porcelain', 'Recycle fiber', 'Release your payload', 'Seek revenge for the Brown Bomber', 'Sink the Bismark', 'Sit on the throne', 'Squeeze the cheese', 'Take the Browns to the Superbowl',
  'Bust a grumpy', 'Build a log cabin', "Make like Snoop and 'Drop it like it's hot'", 'Unloose the caboose', 'Go see a man about a horse', 'Murder a brown snake', 'Download some software',
  'Drop some potatoes in the crock pot', 'Craft a fudge pop', 'Release the Kraken', 'Get something down on paper', 'A brown dog is scratching at the back door', 'Liberate the brown trout',
  'Let the turtles loose', 'Make underwater sculptures', 'Glassing the surface', 'Unload some timber', 'Plant a tree']

//calls lS to see if location has been voted on for before and apply styles
function renderLS(thumbsUpID) {
  if (localStorage.getItem(thumbsUpID) === null) return null;
  if (localStorage.getItem(thumbsUpID) === 'true') {
    document.querySelector('#' + thumbsUpID).setAttribute('class', 'column is-1 result-TU-active');
    document.querySelector('#' + thumbsUpID).nextElementSibling.setAttribute('class', 'column is-1 result-TD-inactive')
  } else {
    document.querySelector('#' + thumbsUpID).setAttribute('class', 'column is-1 result-TU-inactive');
    document.querySelector('#' + thumbsUpID).nextElementSibling.setAttribute('class', 'column is-1 result-TD-active')
  };
}
// adds map markers
function mapMarkers(latitude, longitude) {
  var locCoords = { lat: latitude, lng: longitude };
  var marker = new google.maps.Marker({
    position: locCoords,
    map: map,
  });
}
// appends api call into cards
function appendData(input) {
  docRecent.innerHTML = '';

  for (var i = 0; i < input.length; i++) {
    var createCard = document.createElement('div');
    var createCardTextDiv = document.createElement('div');
    var createCardName = document.createElement('p');
    var createCardLocation = document.createElement('p');
    var createCardRating = document.createElement('p');
    var createThumbsUp = document.createElement('p');
    var createThumbsDown = document.createElement('p');
    var ratingTotal = input[i].upvote + input[i].downvote;
    var rating = input[i].upvote / ratingTotal;

    mapMarkers(input[i].latitude, input[i].longitude);

    createCardName.textContent = input[i].name.toUpperCase();
    createCardName.setAttribute('class', 'card-name');
    createCardLocation.textContent = input[i].street;
    createCardLocation.setAttribute('class', 'card-location');
    if (rating === 0) {
      createCardRating.textContent = 'Rating: 0%';
    } else if (!rating) {
      createCardRating.textContent = 'Rating: Unrated';
    } else {
      createCardRating.textContent = 'Rating: ' + rating * 100 + '%';
    }
    createCardRating.setAttribute('class', 'card-rating');
    createThumbsUp.textContent = String.fromCodePoint(0x1F44D);
    createThumbsDown.textContent = String.fromCodePoint(0x1F44E);
    // creates card and assigns styling
    createCard.setAttribute('class', 'columns is-vcentered is-multiline is-mobile result result' + (i + 1));
    //creates card and assigns card ID for CSS
    createCard.setAttribute('id', 'result' + (i + 1));
    // creates card text content and assign styling
    createCard.appendChild(createCardTextDiv);
    createCardTextDiv.setAttribute('class', 'column result-text-area'
      //  result' + (i + 1)
    );
    createCardTextDiv.appendChild(createCardName);
    createCardTextDiv.appendChild(createCardLocation);
    createCardTextDiv.appendChild(createCardRating);
    // creates thumbs up and assigns styling and unique ID
    createCard.appendChild(createThumbsUp);
    createThumbsUp.setAttribute('class', 'column is-1 result-TU-inactive'
      //  result' + (i + 1)
    )
    createThumbsUp.setAttribute('id', 'TU' + input[i].id);
    // creates thumbs down and assigns styling and unique ID
    createCard.appendChild(createThumbsDown);
    createThumbsDown.setAttribute('class', 'column is-1 result-TD-inactive'
      //  result' + (i + 1)
    )
    createThumbsDown.setAttribute('id', 'TD' + input[i].id);
    // appends card to page
    docRecent.appendChild(createCard);
    renderLS('TU' + input[i].id, 'TD' + input[i].id);
  }
}
// sets zoom distance based on furthest bathroom
function zoomMap(input) {
  map.setZoom(16 - input);
}
// centers the map based on fed coords
function centerMap(pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent("Location found.");
  infoWindow.open(map);
  map.setCenter(pos);
}
// calls restroom API data
function getRestroomAPI(input) {
  fetch('https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=5&offset=0&lat=' + input.lat + '&lng=' + input.lng)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      appendData(data);
      centerMap(input);
      zoomMap(data[4].distance);
    })
}
// issues error for failed geolocation
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
// centers map and calls getRestoomAPI
function geoLocate(event) {
  event.preventDefault()
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var posArray = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        getRestroomAPI(posArray);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
// processes fetch by form
function getLocation(zip) {
  fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=AIzaSyCYtyNqtzqQ6Ni4aB_yASKG_uXHa0_amuE')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      formError.setAttribute('class', 'hidden');
      var posArray = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };
      getRestroomAPI(posArray);
    })
    .catch(function(){
      formError.setAttribute('class', 'shown');
    })
}
// pulls form data
function captureFormData(event) {
  event.preventDefault();
  var formdata = searchForm.value;
  getLocation(formdata);
}
// loads map and calls location of first public bathroom
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.4197, lng: 0.0831 },
    zoom: 12,
  });
  infoWindow = new google.maps.InfoWindow();
  mapMarkers(51.4197, 0.0831);
}
// give random pun to near me button
function poopJokesButton() {
  gottaGo.textContent = poopJokesArray[Math.floor(Math.random() * poopJokesArray.length)];
}
// activates thumbs up and deactivates thumbs down, updates LS
function thumbsUp(event) {
  if (!event.target.classList.contains('result-TU-inactive') === true) return null;
  event.target.setAttribute('class', 'column is-1 result-TU-active');
  event.target.nextElementSibling.setAttribute('class', 'column is-1 result-TD-inactive');
  localStorage.setItem(event.target.id, true);
  localStorage.setItem(event.target.nextElementSibling.id, false);
}
// activates thumbs down and deactivates thumbs up, updates LS
function thumbsDown(event) {
  if (!event.target.classList.contains('result-TD-inactive') === true) return null;
  event.target.setAttribute('class', 'column is-1 result-TD-active');
  event.target.previousElementSibling.setAttribute('class', 'column is-1 result-TU-inactive');
  localStorage.setItem(event.target.id, true);
  localStorage.setItem(event.target.previousElementSibling.id, false);
}
// event listeners and startup functions
gottaGo.addEventListener('click', geoLocate);
searchButton.addEventListener('click', captureFormData);
docRecent.addEventListener('click', thumbsUp);
docRecent.addEventListener('click', thumbsDown);
window.initMap = initMap;
poopJokesButton();