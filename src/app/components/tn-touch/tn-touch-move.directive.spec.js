(function() {
  'use strict';

  describe('tn touchmove directive', function(){
    var el, scope, controller;

    beforeEach(module('transpositron'));

    beforeEach(inject(function($compile, $rootScope) {
      el = angular.element('<div tn-touchmove="touchTest($event)"></div>');

      $compile(el)($rootScope);
      $rootScope.$digest();

      controller = el.controller("tnTouchmove");

      scope = el.isolateScope() || el.scope();
    }));

    it('is defined', inject(function() {
      expect(controller).toBeDefined();
      expect(controller._onTouchMove).toBeDefined();
    }));

    it('calls supplied method', inject(function() {
      var event = {
        preventDefault: function() {}
      };
      scope.touchTest = function() {};

      spyOn(scope, 'touchTest');

      controller._onTouchMove(event);

      expect(scope.touchTest).toHaveBeenCalledWith(event);
    }));
  });
})();
