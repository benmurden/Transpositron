(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('transpositron'));

    it('should define more than 5 technologies', inject(function($controller) {
      var vm = $controller('AboutController');

      expect(angular.isArray(vm.techs)).toBeTruthy();
      expect(vm.techs.length > 5).toBeTruthy();
    }));

    it('gives techs random rank', inject(function($controller) {
      var vm = $controller('AboutController');

      expect(vm.techs[0].hasOwnProperty('rank')).toBeTruthy();
    }));
  });
})();
