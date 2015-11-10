'use strict';

angular.module('campforfreeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    var pos = {
        lat: 57.4296853,
        lng: 12.1612335
      };
    function initialize(pos) {
      var marker;
      var infowindow; 
      var content;
      var zoom = 7;
      var latitude = pos.lat;
      var longitude = pos.lng;
      var LatLng = new google.maps.LatLng(latitude, longitude);
      var style1 = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
      var style2 = [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}];
      var style3 = [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}];
      var mapOptions = {
        zoom: zoom,
        minZoom: 2,
        center: LatLng,
        panControl: false,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById('map'),mapOptions);
      map.setOptions({styles: style2});

      $http.get('/api/addLocations/').success(function(locations) {
        $scope.locations = locations;
        socket.syncUpdates('addLocation', $scope.locations);
        for (var i = 0; i <= $scope.locations.length-1; i++) {
          var latlng = {
            lat: parseFloat($scope.locations[i].latitude),
            lng: parseFloat($scope.locations[i].longitude)
          };
          marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: $scope.locations[i].name,
            info: $scope.locations[i].info,
            tags: $scope.locations[i].tags,
            icon: '../../assets/images/Untitled-1-01.svg'
          });
          
          google.maps.event.addListener(marker, $scope, 'click', function(){
            var id = this.title;
            $http.get('/api/addLocations/showlocation/'+id).success(function(showloc) {
              $scope.showloc = showloc[0];
            });
            // $scope.name = this.title;
            //   $scope.info = this.info;
            //   $scope.tags = this.tags;
            //   console.log(this.title);
          });
        }

      });        
    } // END of initialize :::
    initialize(pos);
    //google.maps.event.addDomListener(window, 'load', initialize);
  });
