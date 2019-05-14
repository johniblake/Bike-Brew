$.ajaxPrefilter(function(options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = "https://ca329482.herokuapp.com/" + options.url;
  }
});
