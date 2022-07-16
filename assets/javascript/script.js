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

// appends api call into cards
function appendData(input) {
  docRecent.innerHTML = '';

  for (var i = 0; i < input.length; i++) {
    var createCard = document.createElement('div');
    var createCardName = document.createElement('h3');
    var createCardLocation = document.createElement('p');
    var createCardRating = document.createElement('p');
    var createThumbsUp = document.createElement("img");
    var createThumbsDown = document.createElement("img");
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
    createThumbsUp.src = "./assets/images/thumUimg.png";
    createThumbsDown.src = "./assets/images/thumbDimg.png";

    createCard.setAttribute('class', 'result')
    createCard.setAttribute('id', 'result' + (i + 1));
    createCard.appendChild(createCardName);
    createCard.appendChild(createCardLocation);
    createCard.appendChild(createCardRating);
    createCard.appendChild(createThumbsUp);
    createCard.appendChild(createThumbsDown);
    docRecent.appendChild(createCard);
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
function initialize() {
  var formdata= searchForm.value;
  console.log(formdata);
}


gottaGo.addEventListener('click', centerMap);
searchButton.addEventListener('click', initialize);
window.initMap = initMap;
poopJokesButton();