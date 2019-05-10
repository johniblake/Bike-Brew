let Breweries = [];

$(document).ready(function() {
  let statusList;
  let infoList;

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
      console.log("response:");
      statusList = response.data;
      console.log(statusList);

      let niceRideInfoURL =
        "https://gbfs.niceridemn.com/gbfs/es/station_information.json";
      var infoSettings = {
        url: niceRideInfoURL,
        method: "GET",
        type: "application/json"
      };

      $.ajax(infoSettings)
        .then(function(response) {
          infoList = response.data;
          console.log(infoList);
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
});
