(function() {
  'use strict';

  describe('GitHub contributor factory', function(){
    var factory, $httpBackend;

    beforeEach(module('transpositron'));

    beforeEach(inject(function(githubContributor, _$httpBackend_) {
        factory = githubContributor;
        $httpBackend = _$httpBackend_;
    }));

    it('is available', inject(function(){
      expect(factory).toBeDefined();
      expect(factory.getContributors).toBeDefined();
    }));

    it('calls API service', inject(function() {
      $httpBackend.expectGET('https://api.github.com/repos/benmurden/transpositron/contributors?per_page=30')
        .respond({});

      factory.getContributors();
      $httpBackend.flush();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
})();
