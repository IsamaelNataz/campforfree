'use strict';

angular.module('campforfreeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    $scope.locations = [];
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

    $scope.showLocation = function(locations){
        var ll = locations.latLng;
        var latlng = ll.lat().toFixed(3) +','+ ll.lng().toFixed(3);
        $http.get('/api/addLocations/showLocation/'+latlng).success(function(showlocation) {
        $scope.showlocation = showlocation[0];
      });
    };
  });
