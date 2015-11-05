'use strict';

angular.module('campforfreeApp')
  .controller('MyLocationCtrl', function ($scope, $http, $location, socket, Auth) {

      var pos = {
        lat: 57.4296853,
        lng: 12.1612335
      };

      function initialize(pos) {
        var latitude = pos.lat;
        var longitude = pos.lng;
        var zoom = 7;
        var newmarker;
        var markers;

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
              markers = new google.maps.Marker({
                position: latlng,
                map: map,
                title: $scope.locations[i].name
              });
            }
          });
          $scope.$on('$destroy', function() {
            socket.unsyncUpdates('addLocation');
          });
        };
        loadMarkers();

      $scope.deleteLocation = function(location) {
        var kojk;
        kojk = confirm("Är du säker att du vill ta bort " + location.name +"?");
        if(kojk){
          $http.delete('/api/addLocations/' + location._id).then(function(){ 
           loadMarkers();
          });
        }
      };
    } // END of initialize :::

    initialize(pos);

});
