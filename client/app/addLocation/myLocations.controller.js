'use strict';

angular.module('campforfreeApp')
  .controller('MyLocationCtrl', function ($scope, $http, $location, socket, Auth) {

      $scope.MyLoc = function(){
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          initialize(pos);
        });
      }

      var pos = {
        lat: 57.4296853,
        lng: 12.1612335
      };

      function initialize(pos) {
        var latitude = pos.lat;
        var longitude = pos.lng;
        var zoom = 7;
        var marker;
        var markers = [];

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

        $http.get('/api/addLocations/Myplaces').success(function(locations) {
          $scope.locations = locations;
          if(locations.length == 0){
            $scope.message = "Du har ej lagt till några platser!";
            $('table').hide();
          }
          socket.syncUpdates('addLocation', $scope.locations);
          for (var i = 0; i <= locations.length-1; i++) {
            var latlng = {
              lat: locations[i].latitude,
              lng: locations[i].longitude
            };

            marker = new google.maps.Marker({
              position: latlng,
              map: map,
              title: locations[i].name,
              icon: '../../assets/images/Untitled-1-01.svg'
            });
            markers.push(marker);
          }

          $scope.deleteLocation = function(location) {
            var res = confirm("Är du säker att du vill ta bort " + location.name +"?");
            if(res){
              $http.delete('/api/addLocations/' + location._id).then(function(){
                 angular.forEach(markers, function(value, key){
                  if (value.title == location.name){
                    markers[key].setMap(null);
                    markers.splice(key, 1);
                  }
                 });
                 if (markers.length == 0) {
                    $scope.message = "Du har ej lagt till några platser!";
                    $('table').hide();
                 }
              });
            }
          };

        });

    } // END of initialize :::

    initialize(pos);

});
