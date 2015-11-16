'use strict';

angular.module('campforfreeApp')
  .controller('EditLocationCtrl', function ($scope, $http, $location, $routeParams, socket) {

    var id = $routeParams.id;
    $http.get('/api/addLocations/'+id).success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
      var pos = {
        lat: parseFloat($scope.locations.latitude),
        lng: parseFloat($scope.locations.longitude)
      };
      $scope.Name = $scope.locations.name;
      $scope.Info = $scope.locations.info;
      $scope.tagselection = $scope.locations.tags;
      initialize(pos);
    });

    function initialize(pos) {
        var latitude = pos.lat;
        var longitude = pos.lng;
        var zoom = 15;
        var marker;
        var style2 = [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}];

        var LatLng = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
          zoom: zoom,
          minZoom: 2,
          center: LatLng,
          panControl: false,
          scaleControl: true,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map'),mapOptions);
        map.setOptions({styles: style2});

        var setMarker = function(){
            if(marker){
              $scope.latitude = pos.lat();
              $scope.longitude = pos.lng();
              marker.setPosition(pos);
              // map.setCenter(pos);
            } else {
              $scope.latitude = pos.lat;
              $scope.longitude = pos.lng;
              marker = new google.maps.Marker({
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
          var validation = true;
          var error = "";
          $http.get('/api/addLocations/').success(function(validlocation) {
            for (var i = 0; i <= validlocation.length-1; i++) {
                if($scope.Name == validlocation[i].name){
                  if (validlocation[i]._id != location._id) {
                    validation = false;
                    error = "Användarnamnet upptaget, var god välj ett annat!";
                    break;
                  }
                }
            };

           if (form.$valid) {
            if (validation) {
               $http.put('/api/addLocations/' + location._id, {
                name: $scope.Name,
                info: $scope.Info,
                latitude: $scope.latitude,
                longitude: $scope.longitude,
                tags: $scope.tagselection
               });
               $scope.Name = '';
               $scope.Info = '';
               $location.path("/minaplatser");
             }else{
                $scope.message = error;
             }
           }

          });
      };

      // $scope.Tags = ['glyphicon glyphicon-tint', 'glyphicon glyphicon-fire', 'glyphicon glyphicon-tree-conifer'];
      $scope.Tags = ['fire.svg', 'fish.svg', 'trash.svg', 'swim.svg', 'toliet.svg', 'camper.svg', 'trees.svg', 'mountain.svg'];
      
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
