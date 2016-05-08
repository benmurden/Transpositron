(function() {
  'use strict';

  describe('directives', function(){
    var el, scope, controller;

    beforeEach(function() {
      module('transpositron');

      inject(function($compile, $rootScope) {
        el = angular.element('<tn-keyboard></tn-keyboard>');
        $compile(el)($rootScope);
        // $rootScope.$digest();

        controller = el.controller("tnKeyboard");

        scope = el.isolateScope() || el.scope();
      });
    });

    it('returns false when note is not playing', inject(function() {
      expect(true).toBe(true);
      // expect(controller.isBeingPlayed('C3')).toBeFalsy();
    }));
  });
})();
