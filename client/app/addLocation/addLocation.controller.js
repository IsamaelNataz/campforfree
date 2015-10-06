'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $scope.addLoc = function() {
      $http.post('/api/addLocations', { name: $scope.Name, longitude: $scope.Longitude, latitude: $scope.Latitude});
      $scope.Name = '';
      $scope.Longitude = '';
      $scope.Latitude = '';

    };
  });
