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
      var deferred, $rootScope;

      beforeEach(inject(function($q, _$rootScope_) {
        deferred = $q.defer();
        $rootScope = _$rootScope_;
      }));

      it('sets standard oscillator type', inject(function() {
        spyOn(wavetables, 'getWavetable');
        service.setWaveform('square');

        expect(wavetables.getWavetable).not.toHaveBeenCalled();
        expect(service.waveform).toEqual('square');
      }));

      it('gets custom waveform from waveform service', inject(function() {
        deferred.resolve({real: [], imag: []});

        spyOn(wavetables, 'getWavetable').and.returnValue(deferred.promise);

        service.setWaveform('bass');
        $rootScope.$apply();

        expect(wavetables.getWavetable).toHaveBeenCalledWith('bass');
        expect(service.waveform).toEqual('bass');
        expect(service.waveforms.bass).toBeDefined();
      }));

      it('displays error when wavetable retreival fails', inject(function(toastr) {
        deferred.reject(404);

        spyOn(wavetables, 'getWavetable').and.returnValue(deferred.promise);
        spyOn(toastr, 'error');

        service.setWaveform('bass');
        $rootScope.$apply();

        expect(wavetables.getWavetable).toHaveBeenCalledWith('bass');
        expect(toastr.error).toHaveBeenCalled();
        expect(service.waveforms.bass).not.toBeDefined();
      }));
    });

    describe('buildOscillatorObject', function() {
      it('builds standard oscillator', inject(function() {
        var result;
        service.waveform = 'square';
        result = service.buildOscillatorObject('C3');

        expect(result).toBeDefined();
        expect(result.osc).toBeDefined();
        expect(result.osc.type).toEqual('square');
      }));

      it('builds wavetable oscillator', inject(function() {
        var result;
        service.waveform = 'bass';
        service.waveforms = {'bass': {}};
        result = service.buildOscillatorObject('C3');

        expect(result).toBeDefined();
        expect(result.osc).toBeDefined();
      }));

      it('warns when wavetable instrument is not ready yet', inject(function(toastr) {
        service.waveform = 'bass';
        spyOn(toastr, 'warning');
        service.buildOscillatorObject('C3');

        expect(toastr.warning).toHaveBeenCalled();
      }));
    });
  });
})();
