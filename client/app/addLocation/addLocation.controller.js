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
          // console.log(pos.lat + ',' + pos.lng);
          var theMapp = document.getElementById('map');
          theMapp.innerHTML = '<marker position="{{marker.coords}}" title="{{marker.name}}" ng-repeat="marker in locations"></marker>'
            if(marker){
              $scope.positions = pos.lat() + ',' + pos.lng();
              marker.setPosition(pos);
              map.setCenter(pos);
            } else {
              $scope.positions = pos.lat + ',' + pos.lng;
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
          $longitude.value = pos.lng();
          setMarker();
        });
        // Marker DRAG event :::
        google.maps.event.addListener(marker, 'dragend', function(e){
          pos = e.latLng;
          $latitude.value = pos.lat();
          $longitude.value = pos.lng();
          setMarker();
        });

        $scope.locations = [];

        $http.get('/api/addLocations').success(function(locations) {
          $scope.locations = locations;
          socket.syncUpdates('addLocation', $scope.locations);
          for (var i = 0; i <= $scope.locations.length-1; i++) {
            var coords = $scope.locations[i].coords;
            var result = coords.split(",");
            var latlng = {
                lat: parseFloat(result[0]),
                lng: parseFloat(result[1])
            };
            new google.maps.Marker({
              position: latlng,
              map: map,
              title: $scope.locations[i].name,
            });

          };
        });

      } // END of initialize :::

      // new google.maps.Marker({
      //       position: pos,
      //       map: map,
      //       title: 'Du är här!',
      // });

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
       };

       if (validation) {
         $http.post('/api/addLocations', {
          name: $scope.Name,
          info: $scope.Info,
          coords: $scope.positions,
          tags: $scope.tagselection
         });
         $scope.Name = '';
 		     $scope.Info = '';
         $scope.tagselection = '';
 		   }
      };

      $scope.deleteLocation = function(location) {
         $http.delete('/api/addLocations/' + location._id);
      };

      $scope.Tags = ['Badplats', 'Eldplats', 'Gloryhole'];

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

      initialize(pos);

    });
  }); // END of Controller :::
