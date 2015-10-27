'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket) {
    navigator.geolocation.getCurrentPosition(function(position) {
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

        // :::
        $scope.locations = [];

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
      } // END of initialize :::


      $http.get('/api/addLocations').success(function(locations) {
        $scope.locations = locations;
        socket.syncUpdates('addLocation', $scope.locations);
      });

      $scope.addLoc = function() {
        var validation = true;
        var alertMessage = '';

        if($scope.Name === undefined && $scope.Info === undefined){
          alertMessage = 'Fyll i fälten';
          validation = false;
        }
        else if($scope.Name === undefined) {
      	   alertMessage = 'Fyll i namn';
       	   validation = false;
       }
       else if ($scope.Info === undefined){
         alertMessage = 'Fyll i info';
         validation = false;
       }

       if (alertMessage) {
       	alert(alertMessage);
       };

       if (validation) {
         $http.post('/api/addLocations', { name: $scope.Name, info: $scope.Info, coords: $scope.positions, tags: $scope.tagselection});
         $scope.Name = '';
 		     $scope.Info = '';
         $location.path('/');
 		   }
      };
      initialize(pos);

    });
  }); // END of Controller :::




// :::::::::::::::::::::::::
// GAMMALT BÖS HÄR UNDER :::
// :::::::::::::::::::::::::


// var setMarker = function(){
//   marker = new google.maps.Marker({
//     position: pos,
//     map: map,
//     title: 'Drag Me!',
//     draggable: true,
//     animation: 'DROP',
//     options: {
//       animation: google.maps.Animation.BOUNCE
//     },
//     icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
//   });
// };
// setMarker();
//
//       google.maps.event.addListener(map, 'click', function(e){
//         pos = e.latLng;
//         $latitude.value = pos.lat();
//         latitude = pos.lat();
//         $longitude.value = pos.lng();
//         longitude = pos.lng();
//         setMarker();
//       });
//       google.maps.event.addListener(marker, 'dragend', function(marker){
//         var latLng = marker.latLng;
//         $latitude.value = latLng.lat();
//         $longitude.value = latLng.lng();
//       });
//
//     }, function() {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   // } else {
//   //   // If Browser doesn't support Geolocation
//   //   handleLocationError(false, infoWindow, map.getCenter());
//   // }
//
//
//
//
//   }
//   initialize();
//   //*** All our earlier job stuff ***//
//
//     // $scope.locations = [];
//     //
//     // $http.get('/api/addLocations').success(function(locations) {
//     //   $scope.locations = locations;
//     //   socket.syncUpdates('addLocation', $scope.locations);
//     // });
//     //
//     // $scope.addLoc = function() {
//     //   // Validation before sending data to the server
//     //   var validation = true;
//     //   var alertMessage = '';
//     //
//     //   if($scope.Name === undefined && $scope.Info === undefined){
//     //     alertMessage = 'Fyll i fälten';
//     //     validation = false;
//     //   }
//     //   else if($scope.Name === undefined) {
//     //   	alertMessage = 'Fyll i namn';
//     //   	validation = false;
//     //   }
//     //   else if ($scope.Info === undefined){
//     //     alertMessage = 'Fyll i info';
//     //     validation = false;
//     //   }
//     //
//     //   if (alertMessage) {
//     //   	alert(alertMessage);
//     //   };
//     //
//     //   if (validation) {
// 		//     $http.post('/api/addLocations', { name: $scope.Name, info: $scope.Info, coords: $scope.positions});
//     //     $scope.Name = '';
// 		//     $scope.Info = '';
//     //     $location.path('/');
// 		//   }
//     //
//     // };
//     //
//     // navigator.geolocation.getCurrentPosition(function(position){
//     //   $scope.positions = position.coords.latitude + ',' + position.coords.longitude;
//     // });
//     //
//     // $scope.deleteLocation = function(location) {
//     //   	$http.delete('/api/addLocations/' + location._id);
//     // };
//     //
//     // $scope.map = {
//     //   zoom: 4
//     // };
//     //
//     // $scope.marker = {
//     //   draggable: true,
//       // animation: 'DROP',
//       // options: {
//       //   animation: google.maps.Animation.BOUNCE
//       // },
//       // icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
//     // };
//     //
//     var addMarker = function(event){
//       alert('röva');
//       var ll = event.latLng;
//       $scope.positions = ll.lat() +','+ ll.lng();
//       console.log(ll.lat() +','+ ll.lng());
//     };
//
//     // $scope.editLocation = function(location){
//     //     $http.get('/api/addLocations/'+location._id).success(function(loc) {
//     //     $scope.loc = loc;
//     //     console.log(loc);
//     //     socket.syncUpdates('addLocation', $scope.loc);
//     // });
//     // };
//     $scope.map = {
//       zoom: 4
//     };
//
//     $scope.marker = {
//       draggable: true,
//       animation: 'DROP',
//       options: {
//         animation: google.maps.Animation.BOUNCE
//       },
//       icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
//     };
//
// 	  $scope.addMarker = function(event) {
//       var ll = event.latLng;
//       alert(ll);
//       $scope.positions = ll.lat() +','+ ll.lng();
// 	  };
//
//     $scope.Tags = ['Badplats', 'Eldplats', 'Gloryhole'];
//
//     // selected tags
//     $scope.tagselection = [];
//
//     $scope.toggleSelection = function(tagName) {
//     var id = $scope.tagselection.indexOf(tagName);
//
//       // is currently selected
//       if (id > -1) {
//         $scope.tagselection.splice(id, 1);
//       }
//
//       // is newly selected
//       else {
//         $scope.tagselection.push(tagName);
//       }
//     };
//
// });
