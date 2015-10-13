'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket) {

    $scope.locations = [];
    $scope.positions = "";

    var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: 'Set lat/lon values for this property',
    draggable: true
});

    $scope.toggleBounce = function() {
      if (this.getAnimation() != null) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    $http.get('/api/addLocations').success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
      // angular.forEach(locations, function (val) {
      //   $scope.positions.push({lat: val.latitude, lng: val.longitude});
      // });
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

        // var  = $scope.positions[0].lat;
        // var longi = $scope.positions[0].lng;
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

      $scope.positions = "";
      var ll = event.latLng;
      console.log($scope.positions);
      $scope.positions = ll.lat() +","+ ll.lng();


      //ll.toggleBounce();

      //console.log(ll.lat(), ll.lng());
      //$http.post('/api/addLocations', { name: '', longitude: ll.lat(), latitude: ll.lng()});
	  }

    $scope.map = {
      center: "current-location",
      zoom: 8,
      position: "current-location",
      animation: "DROP",
      draggable: true,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    }


});
