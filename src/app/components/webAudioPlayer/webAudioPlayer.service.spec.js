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

    describe('playNote', function() {
      it('starts oscillator node', inject(function() {
        var oscMock, duration, a, d, r;
        oscMock = {
          osc: {
            start: function() {},
            stop: function() {}
          },
          gain: {}
        };
        duration = 1;
        a = service.envelopeDefs.a;
        d = service.envelopeDefs.d;
        r = service.envelopeDefs.r;

        spyOn(service, 'buildOscillatorObject').and.returnValue(oscMock);
        spyOn(service, 'envelope');
        spyOn(oscMock.osc, 'start');
        spyOn(oscMock.osc, 'stop');

        service.playNote('C3', duration);

        expect(service.buildOscillatorObject).toHaveBeenCalledWith('C3');
        expect(service.envelope).toHaveBeenCalled();
        expect(oscMock.osc.start).toHaveBeenCalled();
        expect(oscMock.osc.stop).toHaveBeenCalledWith(a + d + duration + r);
      }));
    });

    describe('envelope', function() {
      var gainNode;

      beforeEach(function() {
        gainNode = {
          gain: {
            cancelScheduledValues: function() {},
            setValueAtTime: function() {},
            linearRampToValueAtTime: function() {}
          }
        };
      });

      it('sets gain values', inject(function() {
        service.envelope(gainNode, 0, 1, 1, 1, 1, 1, 1);
      }));

      it('startEnvelope sets gain values', inject(function() {
        service.startEnvelope(gainNode, 0, 1, 1, 1, 1);
      }));

      it('endEnvelope sets gain values', inject(function() {
        service.endEnvelope(gainNode, 0, 1);
      }));
    });

    describe('startNote', function() {
      var oscObj;

      beforeEach(function() {
        oscObj = {
          osc: {
            start: function() {}
          },
          gain: {}
        };

        spyOn(service, 'buildOscillatorObject').and.returnValue(oscObj);
        spyOn(service, 'startEnvelope');
        spyOn(oscObj.osc, 'start');
      });

      it('starts oscillator', inject(function() {
        service.startNote('C3');

        expect(service.startEnvelope).toHaveBeenCalled();
        expect(oscObj.osc.start).toHaveBeenCalled();
        expect(service._playing).toEqual({'C3': oscObj});
      }));

      it('doesn\'t start if already started', inject(function() {
        service._playing = {'C3': {}};
        service.startNote('C3');

        expect(service.startEnvelope).not.toHaveBeenCalled();
        expect(oscObj.osc.start).not.toHaveBeenCalled();
      }));
    });

    describe('endNote', function() {
      var oscObj;

      beforeEach(function() {
        oscObj = {
          osc: {
            stop: function() {}
          },
          gain: {}
        };

        spyOn(service, 'endEnvelope');
        spyOn(oscObj.osc, 'stop');
      });

      it('stops oscillator when playing', inject(function() {
        service._playing = {'C3': oscObj};
        service.endNote('C3');

        expect(service.endEnvelope).toHaveBeenCalled();
        expect(oscObj.osc.stop).toHaveBeenCalled();
        expect(service._playing).toEqual({});
      }));

      it('does nothing when note is not being played', inject(function() {
        service.endNote('C3');

        expect(service.endEnvelope).not.toHaveBeenCalled();
        expect(oscObj.osc.stop).not.toHaveBeenCalled();
      }));
    });
  });
})();
