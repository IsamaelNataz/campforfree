'use strict';

angular.module('campforfreeApp')
  .controller('AddLocationCtrl', function ($scope, $http, $location, socket, Auth) {

    var user = Auth.getCurrentUser()._id;

    $scope.locations = [];

    $http.get('/api/addLocations/').success(function(locations) {
      $scope.locations = locations;
      socket.syncUpdates('addLocation', $scope.locations);
    });
    function initialize() {
    var $latitude = document.getElementById('latitude');
    var $longitude = document.getElementById('longitude');
    var latitude = 50.715591133433854;
    var longitude = -3.53485107421875;
    var zoom = 7;

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


    //*** Check Geolocation compatibility
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

    };

    navigator.geolocation.getCurrentPosition(function(position){
      $scope.positions = position.coords.latitude + "," + position.coords.longitude; 

      // var LatLng = new google.maps.LatLng(pos.lat, pos.lng);
      map.setCenter(pos);
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Drag Me!',
        draggable: true,
        animation: 'DROP',
        options: {
          animation: google.maps.Animation.BOUNCE
        },
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

      google.maps.event.addListener(marker, 'dragend', function(marker){
        var latLng = marker.latLng;
        $latitude.value = latLng.lat();
        $longitude.value = latLng.lng();
      });


    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // If Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  }
  initialize();
  //*** All our earlier job stuff ***//
    //
    // $scope.addLoc = function() {
    //   // Validation before sending data to the server
    //   var validation = true;
    //   var alertMessage = '';
    //
    //   if($scope.Name === undefined && $scope.Info === undefined){
    //     alertMessage = 'Fyll i fälten';
    //     validation = false;
    //   }
    //   else if($scope.Name === undefined) {
    //   	alertMessage = 'Fyll i namn';
    //   	validation = false;
    //   }
    //   else if ($scope.Info === undefined){
    //     alertMessage = 'Fyll i info';
    //     validation = false;
    //   }
    //
    //   if (alertMessage) {
    //   	alert(alertMessage);
    //   };
    //
    //    if (validation) {
    //     $http.post('/api/addLocations', { 
    //       name: $scope.Name, 
    //       info: $scope.Info, 
    //       coords: $scope.positions, 
    //       tags: $scope.tagselection,
    //       userid: user
    //     });
    //     $scope.Name = '';
    //     $scope.Info = '';
    //   }
    //
    // };
    //
    // navigator.geolocation.getCurrentPosition(function(position){
    //   $scope.positions = position.coords.latitude + ',' + position.coords.longitude;
    // });
    //
    // $scope.deleteLocation = function(location) {
    //   	$http.delete('/api/addLocations/' + location._id);
    // };
    //
    // $scope.map = {
    //   zoom: 4
    // };
    //
    // $scope.marker = {
    //   draggable: true,
      // animation: 'DROP',
      // options: {
      //   animation: google.maps.Animation.BOUNCE
      // },
      // icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    // };

	  $scope.addMarker = function(event) {
      var ll = event.latLng;
      $scope.positions = ll.lat() +','+ ll.lng();
	  };

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

});
