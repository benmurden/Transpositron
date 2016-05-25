(function() {
  'use strict';

  describe('Wavetables service', function(){
    var service, $httpBackend, $log, url;

    url = 'assets/wavetables/square.json';

    beforeEach(module('transpositron'));

    beforeEach(inject(function(wavetables, _$httpBackend_, _$log_) {
        service = wavetables;
        $httpBackend = _$httpBackend_;
        $log = _$log_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('is available', inject(function(){
      expect(service).toBeDefined();
      expect(service.getWavetable).toBeDefined();
    }));

    it('calls API service', inject(function() {
      $httpBackend.expectGET(url)
        .respond({});

      service.getWavetable('square');
      $httpBackend.flush();
    }));

    it('handles API error', inject(function() {
      $httpBackend.whenGET(url)
        .respond(400, '');

      service.getWavetable('square');
      $httpBackend.flush();
      expect($log.warn.logs.length).toEqual(1);
    }));
  });
})();
