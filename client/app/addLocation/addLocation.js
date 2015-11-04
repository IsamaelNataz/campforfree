'use strict';

angular.module('campforfreeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/laggtillplats', {
        templateUrl: 'app/addLocation/addLocation.html',
        controller: 'AddLocationCtrl',
        authenticate: true
      })
      .when('/redigeraplats/:id', {
        templateUrl: 'app/addLocation/editLocation.html',
        controller: 'EditLocationCtrl',
        authenticate: true
      })
      .when('/minaplatser', {
        templateUrl: 'app/addLocation/myLocations.html',
        controller: 'MyLocationCtrl',
        authenticate: true
      })
  });
