let map, infoWindow;
var gottaGo = document.querySelector('#custom-map-control-button');
var docRecent = document.querySelector('#recent');

// appends cards to #recent
function appendData(input) {
  console.log(input);

  for (var i = 0; i < input.length; i++) {
    var createCard = document.createElement('div');
    var createCardName = document.createElement('h3');
    var createCardLocation = document.createElement('p');
    var createCardRating = document.createElement('p');
    var ratingTotal = input[i].upvote + input[i].downvote;
    var rating = input[i].upvote / ratingTotal;
    console.log(rating);

    createCardName.textContent = 'Name: ' + input[i].name;
    createCardLocation.textContent = 'Location: ' + input[i].street + ', ' + input[i].city;
    if (!rating) {
      createCardRating.textContent = 'Rating: Unrated';
    } else {
      createCardRating.textContent = 'Rating: ' + rating;
    }

    createCard.appendChild(createCardName);
    createCard.appendChild(createCardLocation);
    createCard.appendChild(createCardRating);
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
    zoom: 15,
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

window.initMap = initMap;

gottaGo.addEventListener('click', centerMap);