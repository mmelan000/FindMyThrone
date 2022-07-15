let map, infoWindow;
var gottaGo = document.querySelector('#custom-map-control-button');

// calls restroom API data
function getRestroomAPI(lat, lon) {
  fetch('https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=5&offset=0&lat=' + lat + '&lng=' + lon)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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