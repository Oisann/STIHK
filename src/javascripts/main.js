var app = angular.module('stihk', []),
    nextWeather = 0;

app.factory('socket', function() {
  return io.connect();
});

app.controller('StihkController', ['$scope', 'socket', function($scope, socket){
  socket.on('console', function(data) {
    console.log('Got msg:', data.msg);
  });
  socket.on('feeditem', function(data) {
    $scope.feeditems.push(data);
    $scope.$digest();
  });
}]);

$(document).ready(function() {
  displayFeed($(window).width());
  getWeather();
  setInterval(function() {
    if(nextWeather < Math.round(new Date().getTime())) getWeather(); //Update weather randomly
  }, 1000);
  $(window).resize(function() {
    displayFeed($(this).width());
  });
});

var displayFeed = function(width) {
  if($('#feed').length <= 0) {
    if(width >= 980) {
      $('body').append('<div class="navbar-default" id="feed"></div>');
      $('#cont').removeClass('nofeed');
    }
  } else {
    if(width <= 980) {
      $('#feed').remove();
      $('#cont').addClass('nofeed');
    }
  }
}

var $weather = false; //Only allow one update at a time
var getWeather = function() {
  if($('header #weather').hasClass('hidden')
    || $weather) return;
  $weather = true;
  $.getJSON('api/weather/local', function(json){
    updateWeather(json);
  }).fail(function() {
    updateWeather();
  });
}

var updateWeather = function(data) {
  var div = $('header #weather');
  $weather = false;
  if(data === undefined) return; //No data, no animation
  nextWeather = Math.round(new Date().getTime() + (Math.random() * 100000) + 30000); //Update the weather again in 30-130 sec
  console.log('The weather has been updated!', 'Updating view.', 'Next update in', (nextWeather - new Date().getTime()) / 1000, 'seconds');
  div.animate({ opacity: 0.0 }, 1000, function() {
    div.find('.trondheim .weather').text(data.trondheim.temp);
    div.find('.korsvegen .weather').text(data.korsvegen.temp);
    div.find('.trondheim').attr('title', data.trondheim.title);
    div.find('.korsvegen').attr('title', data.korsvegen.title);
    div.animate({ opacity: 1.0 }, 1000);
  });
}
