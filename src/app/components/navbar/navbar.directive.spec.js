(function() {
  'use strict';

  describe('navbar directive', function(){
    var el, scope, controller, moment, momentObj;

    beforeEach(module('transpositron'));

    beforeEach(inject(function($compile, $rootScope, _moment_) {
      moment = _moment_;
      el = angular.element('<acme-navbar creation-date="creationDate"></acme-navbar>');

      $compile(el)($rootScope);
      $rootScope.$digest();

      controller = el.controller("acmeNavbar");

      scope = el.isolateScope() || el.scope();
    }));

    it('is defined', inject(function() {
      expect(controller).toBeDefined();
    }));
  });
})();
