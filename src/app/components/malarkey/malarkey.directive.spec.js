(function() {
  'use strict';

  describe('malarkey directive', function(){
    var el, scope, controller, githubContributor, deferred;

    beforeEach(module('transpositron'));

    beforeEach(inject(function($compile, $rootScope, $q, _githubContributor_) {
      githubContributor = _githubContributor_;
      deferred = $q.defer();
      el = angular.element('<acme-malarkey></acme-malarkey>');

      deferred.resolve([{login: 'BenMurden'}]);

      spyOn(githubContributor, 'getContributors').and.returnValue(deferred.promise);

      $compile(el)($rootScope);
      $rootScope.$digest();

      controller = el.controller("acmeMalarkey");

      scope = el.isolateScope() || el.scope();
    }));

    it('is defined', inject(function() {
      expect(controller).toBeDefined();
      expect(githubContributor.getContributors).toHaveBeenCalledWith(10);
    }));

    it('sets contributors', inject(function() {
      expect(controller.contributors).toEqual([{login: 'BenMurden'}]);
    }));
  });
})();
