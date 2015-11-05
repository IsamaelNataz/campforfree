'use strict';

angular.module('campforfreeApp')
  .controller('EditLocationCtrl', function ($scope, $http, $location, $routeParams, socket) {

    var id = $routeParams.id;
    $http.get('/api/addLocations/'+id).success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
      var coords = $scope.locations.coords;
      var result = coords.split(",");
      var pos = {
        lat: parseFloat(result[0]),
        lng: parseFloat(result[1])
      };
      $scope.Name = $scope.locations.name;
      $scope.Info = $scope.locations.info;
      $scope.tagselection = $scope.locations.tags;
      initialize(pos);
    });

    function initialize(pos) {
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
          scaleControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map'),mapOptions);

        var setMarker = function(){
          // console.log(pos.lat + ',' + pos.lng);
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
          setMarker();
        });
        // Marker DRAG event :::
        google.maps.event.addListener(marker, 'dragend', function(e){
          pos = e.latLng;
          setMarker();
        });

        $scope.editLoc = function(form, location) {
         if (form.$valid) {
           $http.put('/api/addLocations/' + location._id, {
            name: $scope.Name,
            info: $scope.Info,
            coords: $scope.positions,
            tags: $scope.tagselection
           });
           $scope.Name = '';
           $scope.Info = '';
           $location.path("/minaplatser");
         }
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

      } // END of initialize :::

});
