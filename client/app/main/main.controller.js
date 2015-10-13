'use strict';

angular.module('campforfreeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    // Mumbo-jumbo for the Geolocation
    // var get_location = function(){
    //   navigator.geolocation.getCurrentPosition(show_map);
    // }

    // console.log(get_location);

    $scope.locations = [];
    // console.log(navigator.geolocation.getCurrentPosition);
    $http.get('/api/addLocations').success(function(location) {
      $scope.locations = location;
      socket.syncUpdates('addLocation', $scope.locations);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
