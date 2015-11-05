'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket, Auth) {

    navigator.geolocation.getCurrentPosition(function(position) {

      //Get the name from the user that's logged-in
      var user = Auth.getCurrentUser().name;
      var validation;

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
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

        var setMarker = function(){
            if(newmarker){
              $scope.latitude = pos.lat();
              $scope.longitude = pos.lng();
              newmarker.setPosition(pos);
              map.setCenter(pos);
            } else {
              $scope.latitude = pos.lat;
              $scope.longitude = pos.lng;
              newmarker = new google.maps.Marker({
              position: pos,
              map: map,
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
              var latlng = {
                lat: parseFloat($scope.locations[i].latitude),
                lng: parseFloat($scope.locations[i].longitude)
              };
              markers = new google.maps.Marker({
                position: latlng,
                map: map,
                title: $scope.locations[i].name
              });
            }
          });
        };
        loadMarkers();

        // Marker CLICK event :::
        google.maps.event.addListener(map, 'click', function(e){
          pos = e.latLng;
          setMarker();
        });
        // Marker DRAG event :::
        google.maps.event.addListener(newmarker, 'dragend', function(e){
          pos = e.latLng;
          setMarker();
        });

      $scope.addLoc = function(form) {
        var validName;
        var keepGoing = true;
        $http.get('/api/addLocations/').success(function(validlocation) {
            angular.forEach(validlocation, function(value, key) {
              if (keepGoing) {
                if(value.name != $scope.Name){
                  validName = true;
                } 
                else {
                  validName = false;
                  keepGoing = false;
                }
                console.log(value.latitude + " , " + value.longitude);
              };
            });


         if (form.$valid) {
          if (validName) {
            console.log("Skickat");
             // $http.post('/api/addLocations', {
             //  name: $scope.Name,
             //  info: $scope.Info,
             //  latitude: $scope.latitude,
             //  longitude: $scope.longitude,
             //  userid: user,
             //  tags: $scope.tagselection
             // }).then(function(){
             //   $scope.Name = '';
             //   $scope.Info = '';
             //   var tags = document.getElementsByClassName('tags');
             //   for (var i = 0; i <= tags.length - 1; i++) {
             //     tags[i].checked = false;
             //   };
             //   for (var i = 0; i <= $scope.tagselection.length - 1; i++) {
             //     $scope.toggleSelection($scope.tagselection[i]);
             //   };
             //   loadMarkers();
             //   $scope.message = "Platsen tillagd";
             //   $location.path("/minaplatser");
             //  });
           } else {
            $scope.message = "Användarnamnet upptaget, välj ett annat!";
           }
         }
        });
      };

      $scope.deleteLocation = function(location) {
       $http.delete('/api/addLocations/' + location._id).then(function(){
        loadMarkers();
       });
      };

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('addLocation');
      });

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
