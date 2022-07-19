let map, infoWindow;
var searchForm = document.querySelector("#search")
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

// appends api call into cards
function appendData(input) {
  docRecent.innerHTML = '';

  for (var i = 0; i < input.length; i++) {
    console.log(input[i]);
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

    createCardName.textContent = 'Name: ' + input[i].name;
    createCardLocation.textContent = 'Location: ' + input[i].street + ', ' + input[i].city;
    if (rating === 0) {
      createCardRating.textContent = 'Rating: 0%';
    } else if (!rating) {
      createCardRating.textContent = 'Rating: Unrated';
    } else {
      createCardRating.textContent = 'Rating: ' + rating * 100 + '%';
    }
    createThumbsUp.textContent = String.fromCodePoint(0x1F44D);
    createThumbsDown.textContent = String.fromCodePoint(0x1F44E);
    // creates card and assigns styling
    createCard.setAttribute('class', 'columns is-vcentered result result' + (i + 1));
    //creates card and assigns card ID for CSS
    createCard.setAttribute('id', 'result' + (i + 1));
    // creates card text content and assign styling
    createCard.appendChild(createCardTextDiv);
    createCardTextDiv.setAttribute('class', 'column is-10 result-text-area'
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
// calls restroom API data
function getRestroomAPI(lat, lon) {
  fetch('https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=5&offset=0&lat=' + lat + '&lng=' + lon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      appendData(data);
      console.log(data);
    })
}
// loads map and calls location of first public bathroom
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.4197, lng: 0.0831 },
    zoom: 12,
  });
  infoWindow = new google.maps.InfoWindow();
}
// centers map and calls getRestoomAPI
function centerMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        getRestroomAPI(position.coords.latitude, position.coords.longitude);

        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
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
// give random pun to near me button
function poopJokesButton() {
  gottaGo.textContent = poopJokesArray[Math.floor(Math.random() * poopJokesArray.length)];
}
// adds map markers
function mapMarkers(latitude, longitude) {
  console.log('mapMarkers called');
  console.log(latitude);
  console.log(longitude);
  var locCoords = { lat: latitude, lng: longitude };
  var marker = new google.maps.Marker({
    position: locCoords,
    map: map,
  });
}
// processes fetch by zip
function getLocationByZip(zip) {
  fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=AIzaSyCYtyNqtzqQ6Ni4aB_yASKG_uXHa0_amuE')
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data) {
      var googleLat = data.results[0].geometry.location.lat;
      var googleLon = data.results[0].geometry.location.lng;
      getRestroomAPI(googleLat, googleLon);
      console.log(data);
    })
}
// identifies location type and forwards data to correct function
function identifyLocationType(input) {
  var checker = Number(input);
  if (Number.isInteger(checker) && checker > 0) {
    getLocationByZip(input);
  } else if (Number.isInteger(checker) && checker <= 0) {
    return;
  } else {
    getLocationByName(input);
  }
}
// pulls form data
function captureFormData() {
  var formdata = searchForm.value;
  identifyLocationType(formdata);
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
gottaGo.addEventListener('click', centerMap);
searchButton.addEventListener('click', captureFormData);
docRecent.addEventListener('click', thumbsUp);
docRecent.addEventListener('click', thumbsDown);
window.initMap = initMap;
poopJokesButton();
// this only is here for testing purposes.
identifyLocationType(19114);