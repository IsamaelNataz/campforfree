'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      function initialize(pos) {
        var $latitude = document.getElementById('latitude');
        var $longitude = document.getElementById('longitude');
        var latitude = pos.lat;
        var longitude = pos.lng;
        var zoom = 7;
        var marker;

        var LatLng = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
          zoom: zoom,
          minZoom: 2,
          center: LatLng,
          panControl: false,
          zoomControl: false,
          scaleControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map'),mapOptions);

        var setMarker = function(){
            if(marker){
              marker.setPosition(pos);
              map.setCenter(pos);
            } else {
              marker = new google.maps.Marker({
              position: pos,
              map: map,
              title: 'Du är här!',
              draggable: true,
              animation: 'DROP',
              options: {
                animation: google.maps.Animation.BOUNCE
              },
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
          }
        };
        setMarker();
        // Marker CLICK event :::
        google.maps.event.addListener(map, 'click', function(e){
          pos = e.latLng;
          $latitude.value = pos.lat();
          // latitude = pos.lat();
          $longitude.value = pos.lng();
          // longitude = pos.lng();
          setMarker();
        });
        // Marker DRAG event :::
        google.maps.event.addListener(marker, 'dragend', function(e){
          pos = e.latLng;
          $latitude.value = pos.lat();
          // latitude = pos.lat();
          $longitude.value = pos.lng();
          // longitude = pos.lng();
          setMarker();
        });
      } // END of initialize :::

      $scope.locations = [];

      $http.get('/api/addLocations').success(function(locations) {
        $scope.locations = locations;
        socket.syncUpdates('addLocation', $scope.locations);
      });

      $scope.addLoc = function() {
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
      }

      if (validation) {
        $http.post('/api/addLocations', {
          name: $scope.Name,
          info: $scope.Info,
          coords: $scope.position,
          tags: $scope.tagselection,
          userid: user
        }).then( function() {
          $scope.message = 'Location added.';
        });
        $scope.Name = '';
        $scope.Info = '';
      }

    };

    $scope.deleteLocation = function(location) {
      	$http.delete('/api/addLocations/' + location._id).then( function() {
          $scope.message = 'Location deleted.';
        });
    };
  }); // END of Controller :::
});
