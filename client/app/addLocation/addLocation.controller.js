'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket, Auth, multipartForm, $filter) {

      //Get the name from the user that's logged-in
      var user = Auth.getCurrentUser().name;

      var pos = {};
      var geo = true;
      var zoomOut;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else { 
        alert("Geolocation is not supported by this browser.");
      }

      function showPosition(position) {
          pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          zoomOut = 13;
          initialize(pos, zoomOut); 

          $scope.myLocation = function(){
            initialize(pos, zoomOut);
            if (!geo) {
              alert('Tillåt att visa din platsinfo för att se vart du befinner dig');
            };
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
        var latitude = pos.lat;
        var longitude = pos.lng;
        var zoom = zoomOut;
        var newmarker;
        var markers;
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
            if(newmarker){
              $scope.latitude = pos.lat();
              $scope.longitude = pos.lng();
              newmarker.setPosition(pos);
              // map.setCenter(pos);
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
          $http.get('/api/addLocations/').success(function(locations) {
            $scope.locations = locations;
            socket.syncUpdates('addLocation', $scope.locations);
            for (var i = 0; i <= locations.length-1; i++) {
              var latlng = {
                lat: locations[i].latitude,
                lng: locations[i].longitude
              };
              markers = new google.maps.Marker({
                position: latlng,
                map: map,
                title: locations[i].name,
                icon: '../../assets/images/camping2-01.svg'
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

      $scope.loc = {};

      $scope.addLoc = function(form) {
        $scope.submitted = true;
        // var uploadUrl = "/upload";
        var validation = true;
        var error = "";
        $http.get('/api/addLocations/').success(function(validlocation) {
            for (var i = 0; i <= validlocation.length-1; i++) {
                if($scope.Name == validlocation[i].name){
                  validation = false;
                  error = "Användarnamnet upptaget, var god välj ett annat!";
                  break;
                }

                else if($scope.latitude.toFixed(5) == validlocation[i].latitude.toFixed(5) && $scope.longitude.toFixed(5) == validlocation[i].longitude.toFixed(5)){
                  validation = false;
                  error = "Platsen är redan utmarkerad, var god välj en annan plats!";
                  break;
                }
            };

           if (form.$valid) {
            if (validation) {      
               $http.post('/api/addLocations', {
                name: $scope.Name,
                info: $scope.Info,
                latitude: $scope.latitude,
                longitude: $scope.longitude,
                userid: user,
                tags: $scope.tagselection
               }).then(function(){
                 $scope.Name = '';
                 $scope.Info = '';
                 // var tags = document.getElementsByClassName('tags');
                 // for (var i = 0; i <= tags.length - 1; i++) {
                 //   tags[i].checked = false;
                 // };
                 // for (var i = 0; i <= $scope.tagselection.length - 1; i++) {
                 //   $scope.toggleSelection($scope.tagselection[i]);
                 // };
                 loadMarkers();
                 //multipartForm.post(uploadUrl, $scope.locfile);
                 $scope.message = "Platsen tillagd";
                 $scope.tagselection = [];
                 $location.path("/minaplatser");
                });
             } else {
              $scope.message = error;
             }
           }
        });
      };

      // $scope.Tags = ['Badplats', 'Eldplats', 'Hav'];
      //$scope.Tags = ['glyphicon glyphicon-tint', 'glyphicon glyphicon-fire', 'glyphicon glyphicon-tree-conifer', 'ion-bonfire', 'ion-ios-trash', 'ion-ios-paw'];
      $scope.Tags = ['fire.svg', 'fish.svg', 'trash.svg', 'swim.svg', 'toliet.svg', 'camper.svg', 'trees.svg', 'mountain.svg'];
      // $scope.Tags = [
      //   { 
      //     name: 'Badplats',
      //     icon: 'glyphicon glyphicon-tint'
      //   },
      //   {
      //     name: 'Eldplats',
      //     icon: 'glyphicon glyphicon-fire'
      //   },
      //   {
      //     name: 'Hav',
      //     icon: 'glyphicon glyphicon-tree-conifer'
      //   }
      // ];

      // $scope.tagselection = [];

      // $scope.selectedTags = function () {
      //   $scope.tagselection = $filter('filter')($scope.Tags, {checked: true});
      // }; 
      
      $scope.tagselection = [];

      $scope.toggleSelection = function(tagName) {
      var id = $scope.tagselection.indexOf(tagName);
      console.log(tagName);

        // is currently selected
        if (id > -1) {
          $scope.tagselection.splice(id, 1);
        }

        // is newly selected
        else {
          $scope.tagselection.push(tagName);
        }
        console.log($scope.tagselection);
      };

      } // END of initialize :::

});
