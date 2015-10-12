'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket) {

    $scope.locations = [];
    $scope.positions = "";

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

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.positions = pos.J +","+pos.M;
    });

	  $scope.addMarker = function(event) {

      $scope.positions = "";
      var ll = event.latLng;
      $scope.positions = ll.lat() +","+ ll.lng();
      
	  }

    $scope.map = {
      zoom: 5
    }

    $scope.marker = {
      draggable: true,
      animation: "DROP",
      options: {
        animation: google.maps.Animation.BOUNCE
      },
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    }

});
