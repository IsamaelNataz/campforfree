'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket) {

    $scope.locations = [];
    $scope.positions = 'current-location';

    $http.get('/api/addLocations').success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
    });

    $scope.addLoc = function() {
      var validation = true;
      var alertMessage = '';

      if($scope.Name === undefined) {
      	alertMessage = 'Fyll i namn';
      	validation = false;
      }

      if (alertMessage) {
      	alert(alertMessage);
      };

      if (validation) {

		    $http.post('/api/addLocations', { name: $scope.Name, coords: $scope.positions});
        $scope.Name = '';
		    $scope.Longitude = '';
		    $scope.Latitude = '';
        $scope.positions = '';
        $location.path('/');
		  }

    };

    $scope.deleteLocation = function(location) {
      	$http.delete('/api/addLocations/' + location._id);
    };

	  $scope.addMarker = function(event) {

      var ll = event.latLng;
      console.log($scope.positions);
      $scope.positions = ll.lat() +','+ ll.lng();

	  };

    $scope.map = {
      zoom: 5
    };

    $scope.marker = {
      draggable: true,
      animation: 'DROP',
      options: {
        animation: google.maps.Animation.BOUNCE
      },
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    };

});
