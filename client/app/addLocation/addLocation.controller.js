'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, socket) {
    $scope.locations = [];

    $http.get('/api/addLocations').success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
    });

    // addValue test
    $scope.addValue = function() {
      alert('value');
      // var input = getElementById('latitude');
      // input.value = $scope.Latitude;
    };

    $scope.addLoc = function() {
      var validation = true;
      var alertMessage = '';

      if ($scope.Name === undefined && $scope.Longitude === undefined && $scope.Latitude === undefined) {
      	alertMessage = 'Fyll i fälten fö faen';
      	validation = false;
      }
      else if($scope.Name === undefined) {
      	alertMessage = 'Fyll i namn';
      	validation = false;
      }
      else if($scope.Latitude === undefined || isNaN($scope.Latitude)) {
			alertMessage = 'Fyll i latitud(Siffra)';
			validation = false;
      }
      else if($scope.Longitude === undefined || isNaN($scope.Longitude)) {
	      	alertMessage = 'Fyll i longitud(Siffra)';
	      	validation = false;
	  }

      if (alertMessage) {
      	alert(alertMessage);
      };

      if (validation) {
      	$http.post('/api/addLocations', { name: $scope.Name, longitude: $scope.Longitude, latitude: $scope.Latitude});
	    $scope.Name = '';
	    $scope.Longitude = '';
	    $scope.Latitude = '';
      };

    };

    $scope.deleteLocation = function(location) {
      $http.delete('/api/addLocations/' + location._id);
    };

  });
