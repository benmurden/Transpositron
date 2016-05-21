(function() {
  'use strict';

  describe('GitHub contributor factory', function(){
    var factory, $httpBackend, $log, apiUrl;

    apiUrl = 'https://api.github.com/repos/benmurden/transpositron/contributors?per_page=';

    beforeEach(module('transpositron'));

    beforeEach(inject(function(githubContributor, _$httpBackend_, _$log_) {
        factory = githubContributor;
        $httpBackend = _$httpBackend_;
        $log = _$log_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('is available', inject(function(){
      expect(factory).toBeDefined();
      expect(factory.getContributors).toBeDefined();
    }));

    it('calls API service', inject(function() {
      $httpBackend.expectGET(apiUrl + '30')
        .respond({});

      factory.getContributors();
      $httpBackend.flush();
    }));

    it('handles API error', inject(function() {
      $httpBackend.whenGET(apiUrl + '30')
        .respond(500, '');

      factory.getContributors();
      $httpBackend.flush();
      expect($log.error.logs.length).toEqual(1);
    }));
  });
})();
