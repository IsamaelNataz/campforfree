'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket) {

    $scope.locations = [];
    $scope.positions = [];

    $http.get('/api/addLocations').success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
      // angular.forEach(locations, function (val) {
      //   $scope.positions.push({lat: val.latitude, lng: val.longitude});
      // });
    });

    $scope.addLoc = function() {
      var validation = true;
      var alertMessage = "";

      if($scope.Name === undefined) {
      	alertMessage = 'Fyll i namn';
      	validation = false;
      }

      if (alertMessage) { 
      	alert(alertMessage);
      };

      if (validation) {
        var lati = $scope.positions[0].lat;
        var longi = $scope.positions[0].lng;
		    $http.post('/api/addLocations', { name: $scope.Name, longitude: lati, latitude: longi});
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
      $scope.positions.push({lat:ll.lat(), lng: ll.lng()});
      console.log($scope.positions);
      
      //console.log(ll.lat(), ll.lng());
      //$http.post('/api/addLocations', { name: '', longitude: ll.lat(), latitude: ll.lng()});
	  }
});
