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

    it('uses cache', inject(function($rootScope) {
      var result, f32array;
      f32array = new Float32Array();

      $httpBackend.expectGET(url)
        .respond({real: [], image: []});

      service.getWavetable('square');
      $httpBackend.flush();

      service.getWavetable('square').then(function(value) {result = value;});
      $rootScope.$apply();

      expect(result).toEqual({real: f32array, imag: f32array});
    }));
  });
})();
