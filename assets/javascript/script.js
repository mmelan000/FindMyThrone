

function getRestroomAPI (lat, lon) {
    fetch ('https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=5&offset=0&lat=' + lat + '&lng=' + lon)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
}

getRestroomAPI(45, -70);