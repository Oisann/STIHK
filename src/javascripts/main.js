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
  console.log('Loaded!');
});
