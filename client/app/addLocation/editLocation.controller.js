'use strict';

angular.module('campforfreeApp')
  .controller('EditLocationCtrl', function ($scope, $http, $location, $routeParams, socket) {

    var kojk = "";

  	var id = $routeParams.id;
    $http.get('/api/addLocations/'+id).success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
      $scope.position = $scope.locations.coords;
      $scope.Info = $scope.locations.info;
      $scope.tagselection = $scope.locations.tags;
    });

    $scope.editLoc = function (location){
    	$http.put('/api/addLocations/' + location._id, {
        name: $scope.Name, 
        info: $scope.Info,
        coords: $scope.position,
        tags: $scope.tagselection
      });
      $location.path('/addLocation');
    }

    $scope.addMarker = function(event) {
      var ll = event.latLng;
      $scope.position = ll.lat() +','+ ll.lng();
	  };

    $scope.map = {
      zoom: 10
    };

    $scope.marker = {
      draggable: true,
      animation: 'DROP',
      options: {
        animation: google.maps.Animation.BOUNCE
      },
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    };

    $scope.Tags = ['Badplats', 'Eldplats', 'Hav'];

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
