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
      var mapOptions = {
        zoom: zoom,
        minZoom: 2,
        center: LatLng,
        panControl: false,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById('map'),mapOptions);

      $http.get('/api/addLocations/').success(function(locations) {
        $scope.locations = locations;
        socket.syncUpdates('addLocation', $scope.locations);
        for (var i = 0; i <= $scope.locations.length-1; i++) {
          var coords = $scope.locations[i].coords;
          var result = coords.split(",");
          var latlng = {
            lat: parseFloat(result[0]),
            lng: parseFloat(result[1])
          };
          marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: $scope.locations[i].name,
            info: $scope.locations[i].info,
            tags: $scope.locations[i].tags
          });
          
          google.maps.event.addListener(marker, 'click', function(){
            var tags = "";
            var content;
            // $http.get('/api/addLocations/showLocation/'+this.title).success(function(showlocation) {
            // $scope.showlocation = showlocation[0];
            //});

            console.log(this.tags);

            if(typeof this.tags !== 'undefined' && this.tags.length > 0){

              for (var i = 0; i <= this.tags.length-1; i++) {
                  tags += '<button class="btn">'+this.tags[i]+'</button> ';
                  
                  console.log(tags);
                  
                  content = '<div class="infotitle"><div class="iw_title">Namn: '+this.title+'</div><div class="iw_content">Info: '+this.info+'</div>';
                  content += tags;
              } 
            
            } else {
              content = '<div class="iw_container">' +
                          '<div class="iw_title">Namn: '+this.title+'</div>' +
                          '<div class="iw_content">Info: '+this.info+'</div>'+
                          '</div>';
            }
            
            infowindow = new google.maps.InfoWindow({
              content: content
            });
            infowindow.open(map, this)
          });

          google.maps.event.addListener(map, 'click', function() {
            infowindow.close();
          });
        }
      });

      } // END of initialize :::
      initialize(pos);
  });
