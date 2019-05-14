$("#search-btn").on("click", function (event) {
  event.preventDefault();

  var qty = 5;
  var search = $("#search").val().trim();
  var queryURL = "https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=" + search;
  $.ajax({
    url: queryURL,
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "brianiswu-open-brewery-db-v1.p.rapidapi.com",
      "X-RapidAPI-Key": "1d5eb5e604msh86709b1c7a83dbbp1fe08cjsnfd778179a7e0",
    }

  }).then(function (response) {
    $('#search-table tbody').empty();
    for (var i = 0; i < qty; i++) {
      let breweryName = response[i].name;
      let breweryCity = response[i].city;
      let breweryStreet = response[i].street;
      let breweryLong = response[i].longitude;
      let breweryLat = response[i].latitude;
      if (response[i].state === 'Minnesota') {
        let newRow = $("<tr>").append(
          $("<td>").text(breweryName),
          $("<td>").text(breweryCity),
          $("<td>").text(breweryStreet),
        );
        $("#search-table > tbody").append(newRow);
      };
      console.log(breweryName, breweryLong, breweryLat);
    }
  });
});
