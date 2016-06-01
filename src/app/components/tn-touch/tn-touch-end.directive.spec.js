(function() {
  'use strict';

  describe('tn touchend directive', function(){
    var el, scope, controller;

    beforeEach(module('transpositron'));

    beforeEach(inject(function($compile, $rootScope) {
      el = angular.element('<div tn-touchend="touchTest($event)"></div>');

      $compile(el)($rootScope);
      $rootScope.$digest();

      controller = el.controller("tnTouchend");

      scope = el.isolateScope() || el.scope();
    }));

    it('is defined', inject(function() {
      expect(controller).toBeDefined();
      expect(controller._onTouchEnd).toBeDefined();
    }));

    it('calls supplied method', inject(function() {
      var event = {
        preventDefault: function() {}
      };
      scope.touchTest = function() {};

      spyOn(scope, 'touchTest');

      controller._onTouchEnd(event);

      expect(scope.touchTest).toHaveBeenCalledWith(event);
    }));
  });
})();
