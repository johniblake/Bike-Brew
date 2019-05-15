$(document).ready(function() {
  let statusList;
  let infoList;
  let myPosition;

  let combinedList = [];

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getClosestRacks, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function getClosestRacks(position, type = "user") {
    let closestRacks = [[Infinity, {}], [Infinity, {}], [Infinity, {}]];
    myPosition = [position.coords.latitude, position.coords.longitude];
    for (bikeRack in combinedList) {
      let rack = combinedList[bikeRack];
      let delta = distanceBetween(
        myPosition[0],
        myPosition[1],
        rack.lat,
        rack.lon
      );
      if (delta < closestRacks[0][0]) {
        closestRacks[0] = [delta, rack];
      } else if (delta < closestRacks[1][0]) {
        closestRacks[1] = [delta, rack];
      } else if (delta < closestRacks[2][0]) {
        closestRacks[2] = [delta, rack];
      }
    }
    console.log(closestRacks);

    displayResults(type, closestRacks);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred.";
        break;
    }
  }

  function distanceBetween(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Radius of the earth in m
    var dLat = ((lat2 - lat1) * Math.PI) / 180; // deg2rad below
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;
    let distance = R * 2 * Math.asin(Math.sqrt(a));
    //console.log(distance);
    return distance;
  }

  function getMiles(i) {
    return i * 0.000621371192;
  }
  function getMeters(i) {
    return i * 1609.344;
  }

  function getFeet(meters) {
    if (meters < 0) {
      return "input cannot be less than zero";
    } else {
      return meters / 0.3048;
    }
  }

  function displayResults(type, results) {
    let resultsDiv = $("<div>");
    for (result in results) {
      let row = $("<div>");
      let rowName = $("<div>");
      let rowDetails = $("<div>");
      row.addClass("result-row");
      rowName.html(results[result][1].name);
      rowName.addClass("result-row-name");
      rowDetails.append(
        getMiles(results[result][0]).toFixed(2) + " miles away. "
      );
      rowDetails.append(
        "bikes available: " + results[result][1].num_bikes_available
      );
      rowDetails.addClass("result-row-details");
      row.append(rowName);
      row.append(rowDetails);
      resultsDiv.append(row);

      if (type === "brewery") {
        $(".brewery-loading-container").css("display", "none");
        $(".brewery-results").html(resultsDiv);
      } else {
        $(".my-loading-container").css("display", "none");
        $(".my-results").html(resultsDiv);
      }
    }
  }

  $("#search-btn").on("click", function(event) {
    event.preventDefault();
    $(".results").css("display", "block");
    $(".directions").css("display", "none");
    $(".my-results").html("");
    $(".brewery-results").html("");
    $(".my-loading-container").css("display", "flex");
    $(".brewery-loading-container").css("display", "flex");
    var qty = 5;
    var search = $("#search")
      .val()
      .trim();
    var queryURL =
      "https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=" +
      search;
    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "brianiswu-open-brewery-db-v1.p.rapidapi.com",
        "X-RapidAPI-Key": "1d5eb5e604msh86709b1c7a83dbbp1fe08cjsnfd778179a7e0"
      }
    }).then(function(response) {
      $("#search-table tbody").empty();
      for (var i = 0; i < qty; i++) {
        let breweryName = response[i].name;
        let breweryCity = response[i].city;
        let breweryStreet = response[i].street;
        let breweryLong = response[i].longitude;
        let breweryLat = response[i].latitude;
        if (response[i].state === "Minnesota") {
          let newRow = $("<tr>").append(
            $("<td>").text(breweryName),
            $("<td>").text(breweryCity),
            $("<td>").text(breweryStreet)
          );
          newRow.val(breweryLat + " " + breweryLong);
          newRow.attr("id", breweryName);
          newRow.addClass("brewery-row");
          $("#search-table > tbody").append(newRow);

          console.log(breweryName, breweryLong, breweryLat);
        }
      }
    });
  });

  $(document).on("click", ".brewery-row", function(event) {
    let val = $(this)
      .val()
      .split(" ");

    $(".brewery-name").html($(this).attr("id"));
    let breweryPosition = {
      coords: {
        latitude: val[0],
        longitude: val[1]
      }
    };
    console.log(breweryPosition);
    event.preventDefault();
    console.log("hi");
    getClosestRacks(breweryPosition, "brewery");
    getLocation();

    $(".results").css("display", "none");
    $(".directions").css("display", "block");
  });
  const headers = {
    //Origin: "https://ca329482.herokuapp.com/"
  };
  let niceRideStatusURL =
    "https://gbfs.niceridemn.com/gbfs/en/station_status.json";
  var statusSettings = {
    host: "gbfs.niceridemn.com",
    url: niceRideStatusURL,
    method: "GET",
    type: "application/json",
    headers
  };

  $.ajax(statusSettings)
    .then(function(response) {
      //console.log("response:");
      statusList = response.data.stations;
      //console.log(statusList);

      let niceRideInfoURL =
        "https://gbfs.niceridemn.com/gbfs/es/station_information.json";
      var infoSettings = {
        host: "gbfs.niceridemn.com",
        url: niceRideInfoURL,
        method: "GET",
        type: "application/json",
        headers
      };

      $.ajax(infoSettings)
        .then(function(response) {
          infoList = response.data.stations;
          //console.log(infoList);

          for (let i = 0; i < infoList.length; i++) {
            //console.log(i);
            let infoItem = infoList[i];
            let statusItem = statusList[i];
            let bikes = 0;
            if (statusItem.num_bikes_available) {
              bikes = statusItem.num_bikes_available;
            }
            //console.log(infoItem);
            combinedList.push({
              id: infoItem.id,
              name: infoItem.name,
              lat: infoItem.lat,
              lon: infoItem.lon,
              num_bikes_available: bikes
            });
          }
        })
        .done(console.log("Got bikes!"))
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
});
