$(document).ready(function() {
  let statusList;
  let infoList;

  let combinedList = [];

  jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = "https://ca329482.herokuapp.com/" + options.url;
    }
  });
  let niceRideStatusURL =
    "https://gbfs.niceridemn.com/gbfs/en/station_status.json";
  var statusSettings = {
    url: niceRideStatusURL,
    method: "GET",
    type: "application/json"
  };

  $.ajax(statusSettings)
    .then(function(response) {
      //console.log("response:");
      statusList = response.data.stations;
      //console.log(statusList);

      let niceRideInfoURL =
        "https://gbfs.niceridemn.com/gbfs/es/station_information.json";
      var infoSettings = {
        url: niceRideInfoURL,
        method: "GET",
        type: "application/json"
      };

      $.ajax(infoSettings)
        .then(function(response) {
          infoList = response.data.stations;
          //console.log(infoList);

          for (let i = 0; i < infoList.length; i++) {
            console.log(i);
            let infoItem = infoList[i];
            let statusItem = statusList[i];
            let bikes = 0;
            if (statusItem.num_bikes_available) {
              bikes = statusItem.num_bikes_available;
            }
            console.log(statusItem);
            combinedList.push({
              id: infoItem.id,
              lat: infoItem.lat,
              lon: infoItem.lon,
              num_bikes_available: bikes
            });
          }
          console.log(combinedList);
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
});
