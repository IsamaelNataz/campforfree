'use strict';

angular.module('campforfreeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addLocation', {
        templateUrl: 'app/addLocation/addLocation.html',
        controller: 'AddLocationCtrl'
        //,authenticate: true
      })
      .when('/editLocation/:id', {
        templateUrl: 'app/addLocation/editLocation.html',
        controller: 'EditLocationCtrl'
        //,authenticate: true
      })
  });
