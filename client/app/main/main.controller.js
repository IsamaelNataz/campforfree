'use strict';

angular.module('campforfreeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    // Mumbo-jumbo for the Geolocation
 //    var map;
 //
 // function initialize() {
 //     var myLatlng1 = new google.maps.LatLng(30.65914, 0.072050);
 //
 //     var mapOptions = {
 //         zoom: 2,
 //         center: myLatlng1,
 //         mapTypeId: google.maps.MapTypeId.ROADMAP
 //     };
 //     var map = new google.maps.Map(document.getElementById('map-cont'),
 //     mapOptions);
 //
 //     if (navigator.geolocation) {
 //         navigator.geolocation.getCurrentPosition(function (position) {
 //             initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 //             map.setCenter(initialLocation);
 //         });
 //     }
 // }
 // initialize();
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
  });
