'use strict';

angular.module('campforfreeApp')
  .controller('MyLocationCtrl', function ($scope, $http, $location, socket, Auth) {

    $http.get('/api/addLocations/Myplaces').success(function(locations) {
      $scope.locations = locations;
      if(locations.length == 0){
        $scope.message = "Du har ej lagt till några platser!";
        $('table').hide();
      }
      socket.syncUpdates('addLocation', $scope.locations);

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
          });
        }
      };

    });

});
