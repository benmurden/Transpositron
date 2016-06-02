(function() {
  'use strict';

  describe('tn touchstart directive', function(){
    var el, scope, controller;

    beforeEach(module('transpositron'));

    beforeEach(inject(function($compile, $rootScope) {
      el = angular.element('<div tn-touchstart="touchTest($event)"></div>');

      $compile(el)($rootScope);
      $rootScope.$digest();

      controller = el.controller("tnTouchstart");

      scope = el.isolateScope() || el.scope();
    }));

    it('is defined', inject(function() {
      expect(controller).toBeDefined();
      expect(controller._onTouchStart).toBeDefined();
    }));

    it('calls supplied method', inject(function() {
      var event = {
        preventDefault: function() {}
      };
      scope.touchTest = function() {};

      spyOn(scope, 'touchTest');

      controller._onTouchStart(event);

      expect(scope.touchTest).toHaveBeenCalledWith(event);
    }));
  });
})();
