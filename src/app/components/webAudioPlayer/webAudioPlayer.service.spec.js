(function() {
  'use strict';

  describe('Web audio player service', function(){
    var service, wavetables;

    beforeEach(module('transpositron'));

    beforeEach(inject(function(webAudioPlayer, _wavetables_) {
        service = webAudioPlayer;
        wavetables = _wavetables_;
    }));

    it('is available', inject(function(){
      expect(service).toBeDefined();
      expect(service.playNote).toBeDefined();
    }));

    describe('setWaveform', function() {
      it('sets standard oscillator type', inject(function() {
        spyOn(wavetables, 'getWavetable');
        service.setWaveform('square');

        expect(wavetables.getWavetable).not.toHaveBeenCalled();
        expect(service.waveform).toEqual('square');
      }));

      it('gets custom waveform from waveform service', inject(function($q, $rootScope) {
        var deferred = $q.defer();
        deferred.resolve({real: [], imag: []});

        spyOn(wavetables, 'getWavetable').and.returnValue(deferred.promise);

        service.setWaveform('bass');
        $rootScope.$apply();

        expect(wavetables.getWavetable).toHaveBeenCalledWith('bass');
        expect(service.waveform).toEqual('bass');
        expect(service.waveforms.bass).toBeDefined();
      }));
    });
  });
})();
