'use strict';

angular.module('campforfreeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    // The infoBox
    $('#infoBox').hide();
      var pos = {};
      var geo = true;
      var zoomOut;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true, maximumAge: 0 });
      } else { 
        alert("Geolocation is not supported by this browser.");
      }

      function showPosition(position) {
          pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          zoomOut = 8;
          initialize(pos, zoomOut); 

          $scope.myLocation = function(){
            console.log(geo);
            if (!geo) {
              alert('Tillåt att visa din platsinfo för att se vart du befinner dig');
            };
            initialize(pos, zoomOut);
          };
      }

      $scope.myLocation = function(){
        if (!geo) {
              alert('Tillåt att visa din platsinfo för att se vart du befinner dig');
            };
      };

      function showError(error) {
          switch(error.code) {
              case error.PERMISSION_DENIED:
                  alert("Tillåt att visa din platsinfo för att se vart du befinner dig");
                  geo = false;
                  pos = {
                        lat: 62.8376996,
                        lng: 15.9853149
                      };
                  zoomOut = 5;
                  initialize(pos, zoomOut);
                  break;
              case error.POSITION_UNAVAILABLE:
                  alert("Location information is unavailable.");
                  break;
              case error.UNKNOWN_ERROR:
                  alert("An unknown error occurred.");
                  break;
          }
      }

      function initialize(pos, zoomOut) {
        var marker;
        var zoom = zoomOut;
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
              // icon: '../../assets/images/Untitled-1-01.svg'
              icon: '../../assets/images/camping2-01.svg'
            });

            google.maps.event.addListener(marker, 'click', function(){
              // var id = this.title;
              $http.get('/api/addLocations/').success(function(showloc) {
                // $scope.showloc = showloc[0];
              });
              $('#infoBox').fadeToggle('slow');
              $scope.name = this.title;
              $scope.info = this.info;
              $scope.tags = this.tags;
            });

          }
          $('#close-infoBox').click(function(e){
            $scope.name = '';
              $scope.info = '';
              $scope.tags = '';
            $('#infoBox').fadeToggle('slow');
            // $('#infoBox').removeClass('show');
          });
        });

       } // END of initialize :::

  });
