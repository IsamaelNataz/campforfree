'use strict';

describe('Controller: AddLocationCtrl', function () {

  // load the controller's module
  beforeEach(module('campforfreeApp'));

  var AddLocationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddLocationCtrl = $controller('AddLocationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
