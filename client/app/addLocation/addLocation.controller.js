'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket, Auth) {

    var user = Auth.getCurrentUser()._id;

    $scope.locations = [];

    $http.get('/api/addLocations/').success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
    });

    //*** All our earlier job stuff ***//
    $scope.addLoc = function() {
      // Validation before sending data to the server
      var validation = true;
      var alertMessage = '';
    
      if($scope.Name === undefined && $scope.Info === undefined){
        alertMessage = 'Fyll i fälten';
        validation = false;
      }
      else if($scope.Name === undefined) {
      	alertMessage = 'Fyll i namn';
      	validation = false;
      }
      else if ($scope.Info === undefined){
        alertMessage = 'Fyll i info';
        validation = false;
      }
    
      if (alertMessage) {
      	alert(alertMessage);
      };
    
       if (validation) {
        $http.post('/api/addLocations', { 
          name: $scope.Name, 
          info: $scope.Info, 
          coords: $scope.position, 
          tags: $scope.tagselection,
          userid: user
        });
        $scope.Name = '';
        $scope.Info = '';
      }
    
    };
    
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.position = position.coords.latitude + ',' + position.coords.longitude;
    });
    
    $scope.deleteLocation = function(location) {
      	$http.delete('/api/addLocations/' + location._id);
    };
    
    $scope.map = {
      zoom: 4
    };
    
    $scope.marker = {
      draggable: true,
      animation: 'DROP',
      options: {
        animation: google.maps.Animation.BOUNCE
      },
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    };

	  $scope.addMarker = function(event) {
      var ll = event.latLng;
      $scope.position = ll.lat() +','+ ll.lng();
	  };

    $scope.Tags = ['Badplats', 'Eldplats', 'Hav'];

    // selected tags
    $scope.tagselection = [];

    $scope.toggleSelection = function(tagName) {
    var id = $scope.tagselection.indexOf(tagName);

      // is currently selected
      if (id > -1) {
        $scope.tagselection.splice(id, 1);
      }

      // is newly selected
      else {
        $scope.tagselection.push(tagName);
      }
    };

});
