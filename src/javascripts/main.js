var app = angular.module('stihk', []);

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

var getWeather = function() {
    $.getJSON('api/weather/local', function(json){
      updateWeather(json);
    }).fail(function() {
      updateWeather();
    });
}

var updateWeather = function(data) {
  var div = $('header #weather');
  if(data === undefined) {
      div.hasClass('hidden') ? console.log('Weather failed') : div.addClass('hidden');
      return;
  }
  if(div.hasClass('hidden')) {
    div.animate({ opacity: 0.0 }, 1, function() {
      div.find('.trondheim .weather').text(data.trondheim.temp);
      div.find('.korsvegen .weather').text(data.korsvegen.temp);
      div.find('.trondheim').attr('title', data.trondheim.title);
      div.find('.korsvegen').attr('title', data.korsvegen.title);
      div.removeClass('hidden');
      div.animate({ opacity: 1.0 }, 1000);
    });
  } else {
    div.animate({ opacity: 0.0 }, 1000, function() {
      div.find('.trondheim .weather').text(data.trondheim.temp);
      div.find('.korsvegen .weather').text(data.korsvegen.temp);
      div.find('.trondheim').attr('title', data.trondheim.title);
      div.find('.korsvegen').attr('title', data.korsvegen.title);
      div.animate({ opacity: 1.0 }, 1000);
    });
  }
}
