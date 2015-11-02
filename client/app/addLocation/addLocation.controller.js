'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket, Auth) {

    navigator.geolocation.getCurrentPosition(function(position) {

      var user = Auth.getCurrentUser().name;

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
            if(marker){
              $scope.positions = pos.lat().toFixed(3) + ',' + pos.lng().toFixed(3);
              marker.setPosition(pos);
              map.setCenter(pos);
            } else {
              $scope.positions = pos.lat.toFixed(3) + ',' + pos.lng.toFixed(3);
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

        var loadMarkers = function(){
          $http.get('/api/addLocations/Myplaces').success(function(locations) {
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
            }
          });
        };
        loadMarkers();

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

      $scope.addLoc = function(form) {
       if (form.$valid) {
         $http.post('/api/addLocations', {
          name: $scope.Name,
          info: $scope.Info,
          coords: $scope.positions,
          userid: user,
          tags: $scope.tagselection
         }).then(function(){
         $scope.Name = '';
         $scope.Info = '';
         var tags = document.getElementsByClassName('tags');
         for (var i = 0; i <= tags.length - 1; i++) {
           tags[i].checked = false;
         };
         for (var i = 0; i <= $scope.tagselection.length - 1; i++) {
           $scope.toggleSelection($scope.tagselection[i]);
         };
         // $scope.changeTag($scope.tagselection);
         // $scope.tagselection = [];
         loadMarkers();
          });
       }
      };

      $scope.deleteLocation = function(location) {
         $http.delete('/api/addLocations/' + location._id).then(function(){
           loadMarkers();
         });
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

      } // END of initialize :::

      initialize(pos);

    });
});
